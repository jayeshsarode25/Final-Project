const express = require('express');
const cookieParser = require('cookie-parser');


const app = express();
app.use(cookieParser());
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({
        message: "Cart service is running"
    });
})


// mount cart routes
const cartRouter = require('../src/routes/route.cart');
app.use('/api/cart', cartRouter);


module.exports = app;