const express = require('express')
const router = express.Router()
import Item from "../model/item"
import Order from "../model/order"

// middleware that is specific to this router
router.use(express.json())

router.post('/create', async (req, res) => {
    let order = await Order.create({status: "Created"})
    return res.status(200).json(order)
})

router.put('/:orderId/add', async (req, res) => {
    let order = await Order.findOne({ _id: req.params.orderId })
    if (null == order)
        return res.status(400).json()
    
    let item = await Item.findOne({sku: req.body.sku})
    if (null == item)
        return res.status(400).json()
    if (item.quantity < req.body.quantity)
        return res.status(400).json()

    order.items.push(req.body)
    order.save()
    
    item.quantity -= req.body.quantity
    item.save()

    return res.status(200).json()
})

router.get('/:orderId/', async (req, res) => {
    let order = await Order.findOne({ _id: req.params.orderId })
    if (null == order)
        return res.status(400).json()

    let result = {
        orderId: order._id,
        items: [],
        total: 0
    }

    for (let item of order.items) {
        const queried = await Item.findOne({sku: item.sku})
        const cost = queried.price * item.quantity
        let discount = 0
        if (queried.discount != null) {
            for (let entry of queried.discount) {
                if (-1 != order.items.findIndex(x => x.sku == entry.sku)) {
                    discount = entry.rate * cost / 100.0
                    break;
                }
            }
        }
        const tax = (cost - discount) * queried.tax / 100.0
        result.items.push({
            sku: queried.sku,
            quantity: item.quantity,
            price: queried.price,
            cost: cost,
            discount: discount,
            tax: tax,
            total: cost - discount + tax
        })
    }

    let total = 0
    for (let item of result.items) {
        total += item.total
    }
    result.total = total

    return res.status(200).json(result)
})

module.exports = router