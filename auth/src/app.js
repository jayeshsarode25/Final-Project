const express = require("express");
const cookieParser = require("cookie-parser");


const app = express();
app.use(cookieParser());
app.use(express.json());

// Mount auth routes
const authRoute = require("./routes/auth.route");
app.use('/api/auth', authRoute);

module.exports = app;