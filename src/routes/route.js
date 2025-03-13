import express from 'express';
import userController from '../controllers/user.js';
import userValidation from '../validation/user.js';


const router = express.Router();

router.post("/auth/register",userValidation.validateRegister, userController.register);
router.post("/auth/login", userController.login);
router.post("/auth/refresh", userController.refreshToken);


export default router;