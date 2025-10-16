const app = require('express');



const server = app();


app.get('/', (req, res) => {
    res.status(200).json({
        message: "AI service is running"
    });
});


module.exports = server;