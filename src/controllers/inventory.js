const express = require('express')
const router = express.Router()
import Item from "../model/item"

// middleware that is specific to this router
router.use(express.json())

router.get('/list', async (req, res) => {
    let items = await Item.find()
    return res.status(200).json(items)
})

router.post('/add', async (req, res) => {
    let item = await Item.findOne({sku: req.body.sku})
    if (item == null) {
        Item.create(req.body)
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

module.exports = router