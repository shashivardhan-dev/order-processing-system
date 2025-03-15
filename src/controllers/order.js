import { validationResult } from 'express-validator';
import Order from "../models/order.js";
import mockInventory from '../mock/inventory.js';
import awsServiceFactory from "../aws/index.js";
import redisClient from "../redis/index.js";
import logger from '../logger/index.js';

const SqsService = awsServiceFactory.createSqsService();
// Create Order
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Validation error while creating order", errors.array());
      return res.status(400).json({ status: false, message: errors.array() });
    }
    const { items } = req.body;
    const userId = req.userId;
    let totalAmount = 0;

    const updatedItems = items.map(item => {
      const inventoryData = mockInventory.findItem(item.productId);
      if (!inventoryData || inventoryData.stock < item.quantity) {
        logger.error(`Item out of stock while creating order for user ${userId}`);
        return res.status(400).send({ status: false, message: ['Item out of stock'] });
      }

      const pricePerItem = inventoryData.price;
      totalAmount += pricePerItem * item.quantity;
      return { ...item, pricePerItem };
    });

    items.forEach((item) => {
      if (!mockInventory.deductStock(item.productId, item.quantity)) {
        throw new Error(`Failed to deduct stock for ${item.productId}`);
      }
    })

    const newOrder = new Order({ userId, items: updatedItems, totalAmount });
    await newOrder.save();

    await SqsService.sendMessage(newOrder._id);

    return res.status(201).json({ status: true, message: ['Order placed successfully'], orderId: newOrder._id });
  } catch (error) {
    logger.error("Unexpected error while creating order", error);
    return res.status(500).json({ status: false, message: ['Internal server error'] });
  }
}


const getOrderById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Validation error while getting order", errors.array());
      return res.status(400).json({ status: false, message: errors.array() });
    }
    const { id } = req.params;
    const cachedOrder = await redisClient.getOrder(id);
    if (cachedOrder) return res.json({ status: true, message: ['Order found'], data: cachedOrder });

    const order = await Order.findById(id);
    if (!order) {
      logger.error(`Order not found for id: ${id}`);
      return res.status(404).send({ status: false, message: ['Order not found'] });
    }

    await redisClient.addOrder(order);
    return res.status(200).json({ status: true, message: ['Order found'], data: order });
  } catch (error) {
    logger.error("Unexpected error while getting order", error);
    return res.status(500).send({ status: false, message: ['Internal server error'] });
  }

}

export default { createOrder, getOrderById }