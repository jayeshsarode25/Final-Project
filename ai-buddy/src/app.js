const app = require('express');
const cookieParser = require('cookie-parser');


const server = app();
server.use(app.json());
server.use(cookieParser());




module.exports = server;