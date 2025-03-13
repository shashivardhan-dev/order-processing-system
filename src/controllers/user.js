import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/user.js';
import config from "../config/index.js"


const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' });
    }
};


const login = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '7d' });
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const refreshToken = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(403).json({ message: 'Access denied' });
        const verified = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const accessToken = jwt.sign({ userId: verified.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }  
}


export default { register, login, refreshToken };