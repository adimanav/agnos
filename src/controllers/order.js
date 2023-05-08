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
        return res.status(400)
    
    let item = await Item.findOne({sku: req.body.sku})
    if (null == item)
        return res.status(400)
    if (item.quantity < req.body.quantity)
        return res.status(400)

    order.items.push(req.body)
    order.save()
    
    item.quantity -= req.body.quantity
    item.save()

    return res.status(200).json()
})

router.get('/:orderId/', async (req, res) => {
    let order = await Order.findOne({ _id: req.params.orderId })
    if (null == order)
        return res.status(400)

    let result = {
        orderId: order._id,
        items: [],
        total: 0
    }

    for (let item of order.items) {
        const queried = await Item.findOne({sku: item.sku})
        const cost = queried.price * item.quantity
        let discount = 0
        if (item.discount != null) {
            for (let entry of item.discount.entries()) {
                let key = entry[0]
                let value = entry[1]
                if (-1 != order.items.findIndex(x => x.sku == key)) {
                    discount = value * cost / 100
                }
                break;
            }
        }
        const tax = (cost - discount) * queried.tax / 100
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