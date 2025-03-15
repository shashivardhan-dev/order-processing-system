import express from 'express';
import userController from '../controllers/user.js';
import userValidation from '../validation/user.js';
import orderController from "../controllers/order.js"
import authMiddleware from '../middlewares/auth.js';
import orderValidation from "../validation/order.js"

const router = express.Router();

router.post("/auth/register", userValidation.validateRegister, userController.register);
router.post("/auth/login", userValidation.validateLogin, userController.login);
router.post("/auth/refresh", userValidation.validateRefreshToken, userController.refreshToken);

router.post("/orders", orderValidation.validateCreateOrder, authMiddleware.auth, orderController.createOrder)
router.get("/orders/:id", orderValidation.validateGetOrder, authMiddleware.auth, orderController.getOrderById)


export default router;