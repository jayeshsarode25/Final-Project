const orderModel = require("../models/order.model");
const axios = require("axios");
const { publishToQueue } = require("../broker/borker");

async function createOrder(req, res) {
  const user = req.user; // Assuming user info is attached to req object
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  try {
    // Fetch user cart from cart service
    const cartResponse = await axios.get(`http://localhost:3002/api/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const products = await Promise.all(
      cartResponse.data.cart.items.map(async (item) => {
        return (
          await axios.get(
            `http://localhost:3001/api/products/${item.productId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        ).data.data;
      })
    );

    let priceAmount = 0;

    const orderItems = cartResponse.data.cart.items.map((item) => {
      // Safely find product by ID (convert both to string for MongoDB)
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString()
      );

      //if not in stock does not allow to create order
      if (product.stock < item.quantity) {
        throw new Error(`Product ${product.title} is out of stock`);
      }

      if (!product) {
        console.error("Product not found for item:", item.productId);
        return null;
      }

      // Access product.price.amount instead of product.price
      const itemTotal = Number(product.price.amount) * Number(item.quantity);
      priceAmount += itemTotal;

      return {
        // Mongoose schema expects `product` field (ObjectId reference)
        product: item.productId,
        quantity: item.quantity,
        price: {
          amount: itemTotal,
          currency: product.price.currency || "INR",
        },
      };
    });

    // filter out any null entries (in case a product was not found)
    const filteredOrderItems = orderItems.filter(Boolean);

    console.log("Total Price Amount:", priceAmount);
    console.log("Order Items:", orderItems);

  const order = await orderModel.create({
      user: user.id,
      items: filteredOrderItems,
            status: "PENDING",
            totalPrice: {
                amount: priceAmount,
                currency: "INR" // assuming all products are in USD for simplicity
            },
            shippingAddress: {
                street: req.body.shippingAddress.street,
                city: req.body.shippingAddress.city,
                state: req.body.shippingAddress.state,
                zip: req.body.shippingAddress.pincode,
                country: req.body.shippingAddress.country,
            }
        })

         await publishToQueue("ORDER_SELLER_DASHBOARD.ORDER_CREATED", order)

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

async function getMyOrders(req, res) {
  const user = req.user; // Assuming user info is attached to req object  

   const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const orders = await orderModel.find({ user: user.id }).skip(skip).limit(limit).exec();
        const totalOrders = await orderModel.countDocuments({ user: user.id });

        res.status(200).json({
            orders,
            meta: {
                total: totalOrders,
                page,
                limit
            }
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

async function getOrderById(req, res) {
   const user = req.user;
    const orderId = req.params.id;

    try {
        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== user.id) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this order" });
        }

        res.status(200).json({ order })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

async function cancelOrder(req, res) {
    const user = req.user;
    const orderId = req.params.id;

    try {
        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== user.id) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this order" });
        }

        // only PENDING orders can be cancelled
        if (order.status !== "PENDING") {
            return res.status(409).json({ message: "Order cannot be cancelled at this stage" });
        }

        order.status = "CANCELLED";
        await order.save();

        res.status(200).json({ order });
    } catch (err) {

        console.error(err);

        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function updateOrderAddress(req, res) {
    const user = req.user;
    const orderId = req.params.id;

    try {
        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== user.id) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this order" });
        }

        // only PENDING orders can have address updated
        if (order.status !== "PENDING") {
            return res.status(409).json({ message: "Order address cannot be updated at this stage" });
        }

        order.shippingAddress = {
            street: req.body.shippingAddress.street,
            city: req.body.shippingAddress.city,
            state: req.body.shippingAddress.state,
            zip: req.body.shippingAddress.pincode,
            country: req.body.shippingAddress.country,
        };

        await order.save();

        res.status(200).json({ order });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,    
  updateOrderAddress
};
