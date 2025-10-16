const express = require("express");
const cookieParser = require("cookie-parser");


const app = express();
app.use(cookieParser());
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({
        message: "Auth service is running"
    });
})


// Mount auth routes
const authRoute = require("./routes/auth.route");
app.use('/api/auth', authRoute);

module.exports = app;