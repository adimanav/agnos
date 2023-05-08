const mongoose = require('mongoose');

const item = new mongoose.Schema({
    sku: String,
    name: String,
    desc: String,
    price: Number,
    tax: Number,
    discount: {
        type: Map,
        of: Number
    },
    quantity: Number
})

const Item = mongoose.model('Item', item)

module.exports = Item