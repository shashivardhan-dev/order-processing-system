import Order from '../models/order.js';
import awsServiceFactory from '../aws/index.js';
import redisClient from '../redis/index.js';
import logger from '../logger/index.js';
import mockInventory from '../mock/inventory.js';
import config from '../config/index.js';

const SqsService = awsServiceFactory.createSqsService();
const SesService = awsServiceFactory.createSesService();


const startWorker = async () => {
    while (true) {
        try {
            const messages = await SqsService.receiveMessage();

            for (const message of messages) {
                const { orderId, retryCount = 0 } = JSON.parse(message.Body);

                logger.info(`Processing order: ${orderId}`);

                try {
                    const order = await Order.findById(orderId).populate('userId');

                    if (order) {
                        order.status = 'Processed';
                        const savedOrder = await order.save();
                        const orderJSON = savedOrder.toObject();

                        const simplifiedOrder = {
                            ...orderJSON,
                            userId: orderJSON.userId._id
                        };

                        await redisClient.addOrder(simplifiedOrder);
                        await SesService.sendOrderConfirmationEmail(orderJSON);
                        logger.info(`Order processed: ${orderId}`);
                    }

                    await SqsService.deleteMessage(message.ReceiptHandle);
                } catch (orderError) {
                    logger.error(`Error processing order ${orderId}:`, orderError);

                    if (retryCount < config.maxSqsRetries) {
                        const updatedMessage = {
                            orderId, 
                            retryCount: retryCount + 1
                        };
                        await SqsService.sendMessage(updatedMessage);
                        logger.info(`Retrying order ${orderId}, attempt ${retryCount + 1}`);
                    } else {
                        logger.error(`Max retries reached for order ${orderId}. Marking as failed.`);
                        const order = await Order.findById(orderId);
                        if (order) {
                            order.status = 'Failed';
                            const savedOrder = await order.save();
                            const orderJSON = savedOrder.toObject();
                            await redisClient.addOrder(orderJSON);
                            // add stock in the inventory for the failed order
                            orderJSON.items.forEach((item) => {
                               mockInventory.addStock(item.productId, item.quantity)
                            })
                        }
                    }

                    await SqsService.deleteMessage(message.ReceiptHandle);
                }
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (error) {
            logger.error("Error while polling SQS queue", error);
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
};

export default startWorker;
