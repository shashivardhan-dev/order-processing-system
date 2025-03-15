import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/user.js';
import config from "../config/index.js"
import logger from '../logger/index.js';

const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error("Validation error while creating user", errors.array());
            return res.status(400).json({ status: false, message: errors.array() });
        }
        const { name, email, password } = req.body;
 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.error(`User already exists with email ${email}`);
            return res.status(400).json({ status: false, message: ['User already exists'] });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        return res.status(201).json({ status: true, message: ['User registered successfully'] });
    } catch (error) {
        logger.error("Unexpected error while registering user", error);
        return res.status(500).json({ status: false, message: ['Internal server error'] });
    }
};


const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error("Validation error while logging in user", errors.array());
            return res.status(400).json({ status: false, message: errors.array() });
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            logger.error(`User not found with email ${email}`);
            return res.status(401).json({ status: false, message: ['Invalid credentials'] });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.error(`Invalid password for user with email ${email}`);
            return res.status(401).json({ status: false, message: ['Invalid credentials'] });
        }
        const accessToken = jwt.sign({ userId: user._id }, config.accessTokenJwtSecret, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id }, config.refreshTokenJwtSecret, { expiresIn: '7d' });
        return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        console.log(error)
        logger.error("Unexpected error while logging in user", error);
        return res.status(500).json({ status: false, message: ['Internal server error'] });
    }
};

const refreshToken = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error("Validation error while refreshing token", errors.array());
            return res.status(400).json({ status: false, message: errors.array() });
        }
        const { refreshToken } = req.body;
        if (!refreshToken) {
            logger.error("Access denied while refreshing token");
            return res.status(403).json({ status: false, message: ['Access denied'] });
        }
        const verified = jwt.verify(refreshToken, config.refreshTokenJwtSecret);
        const accessToken = jwt.sign({ userId: verified.userId }, config.accessTokenJwtSecret, { expiresIn: '15m' });
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.log(error)
        logger.error("Error while refreshing token", error);
        return res.status(500).json({ status: false, message: ['Internal server error'] });
    }
}


export default { register, login, refreshToken };