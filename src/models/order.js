import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: String,
        quantity: Number,
        pricePerItem:Number
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Processed', 'Failed'],
        default: 'Pending'
    }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;