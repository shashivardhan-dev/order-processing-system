import Order from '../models/order.js';
import awsServiceFactory from '../aws/index.js';
import redisClient from '../redis/index.js';
import logger from '../logger/index.js';

const SqsService = awsServiceFactory.createSqsService();
const SesService = awsServiceFactory.createSesService();

const startWorker = async () => {


    while (true) {
        try {
            const messages = await SqsService.receiveMessage();

            for (const message of messages) {
                const { orderId } = JSON.parse(message.Body);

                logger.info(`Processing order: ${orderId}`);

                const order = await Order.findById(orderId).populate('userId');;
              

                if (order) {
                    order.status = 'Processed';
                    await order.save();
                    await redisClient.addOrder(order);
                    await SesService.sendOrderConfirmationEmail(order);
                    logger.info(`Order processed: ${orderId}`);
                }

                await SqsService.deleteMessage(message.ReceiptHandle);
            }
            await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (error) {
            logger.error("Error while processing order", error);
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }

}


export default startWorker