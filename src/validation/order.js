import { body,param } from 'express-validator';
import mongoose from 'mongoose';


// Validation rules
const validateCreateOrder = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order items must be a non-empty array'),
    body('items.*.productId')
        .isString()
        .notEmpty()
        .withMessage('Product ID must be a non-empty string'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer value'),
    body('items').custom((items) => {
        // Check for duplicate product IDs
        const productIds = items.map(item => item.productId);
        const uniqueIds = new Set(productIds);

        if (productIds.length !== uniqueIds.size) {
            throw new Error('Duplicate products are not allowed in the order');
        }

        return true;
    })
];

const validateGetOrder = [
    param('id')
    .exists()
    .withMessage('orderId is required in params')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid MongoDB ID'),
]

export default { validateCreateOrder, validateGetOrder };