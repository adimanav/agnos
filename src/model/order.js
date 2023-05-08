const mongoose = require('mongoose');

const order = new mongoose.Schema({
    status: String,
    items: [{
        sku: String,
        quantity: Number
    }]
})

const Order = mongoose.model('Order', order)

module.exports = Order