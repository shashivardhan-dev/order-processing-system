import { body } from 'express-validator';

const validateRegister = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail({  gmail_remove_dots: false,
        all_lowercase: false}),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character')
];

const validateLogin = [
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail({  gmail_remove_dots: false,
        all_lowercase: false}),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

const validateRefreshToken = [
    body('refreshToken').notEmpty().withMessage('Refresh token is required')
];
export default  { validateRegister, validateLogin, validateRefreshToken };

