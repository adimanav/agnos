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

    return res.status(200)
})

module.exports = router