const express = require('express');
const cookieParser = require('cookie-parser');

const orderRoute = require('./routes/order.route');



const app = express();
app.use(cookieParser());
app.use(express.json());


app.use('/api/orders', orderRoute);


module.exports = app;