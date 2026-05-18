const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    customerName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },

            name: String,

            price: Number,

            quantity: Number
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Order', orderSchema);