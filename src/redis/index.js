import { createClient } from 'redis';
import config from '../config/index.js';
import logger from '../logger/index.js';

const redisClient = createClient({ url: config.redisUrl });
redisClient.connect();


const addOrder = (order) => {
    try {

        redisClient.setEx(order._id?.toString(), 600, JSON.stringify(order));
    } catch (error) {
        logger.error("Error while adding order in redis", error);
    }
}

const getOrder = async (orderId) => {
    try {
        const cachedOrder = await redisClient.get(orderId);
        return JSON.parse(cachedOrder);
    } catch (error) {
        logger.error("Error while getting order from redis", error);
    }
}



export default { addOrder, getOrder };