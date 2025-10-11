const express = require('express');
const orderController = require('../controllers/order.controller');
const validation = require('../middlewares/validator.middleware');
const  createAuthMiddleware  = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/", createAuthMiddleware([ "user" ]),validation.createOrderValidation, orderController.createOrder)

router.get("/me", createAuthMiddleware([ "user" ]), orderController.getMyOrders)

router.post("/:id/cancel", createAuthMiddleware([ "user" ]), orderController.cancelOrder)

router.patch("/:id/address", createAuthMiddleware([ "user" ]), validation.updateAddressValidation, orderController.updateOrderAddress)

router.get("/:id", createAuthMiddleware([ "user", "admin" ]), orderController.getOrderById)



module.exports = router;