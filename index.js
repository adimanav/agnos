import express from 'express';
import mongoose from 'mongoose';

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const inventory = require('./src/controllers/inventory')
const order = require('./src/controllers/order')

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/agnos');

app.use('/inventory', inventory)
app.use('/order', order)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(port, () => {
    console.log('listening to port', port);
});