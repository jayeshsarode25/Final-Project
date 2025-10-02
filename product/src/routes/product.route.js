const express = require("express");
const multer = require("multer");
const productController = require("../controllers/product.controller");
const createAuthMiddleware = require("../middleware/auth.middleware");
const { createProductValidators, updateProductValidators } = require("../middleware/product.validator");

const router = express.Router();

// use memory storage so we can access file.buffer directly in tests
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/",
  createAuthMiddleware(["admin", "seller"]),
  upload.array("images", 5),
  createProductValidators,
  productController.createProduct
);// For multipart/form-data, multer must run before express-validator can read files and text fields.


router.get("/", productController.getProducts);

router.patch('/:id', createAuthMiddleware(['seller']), productController.updateProduct);

router.delete('/:id', createAuthMiddleware(['seller']), productController.deleteProduct);

router.get("/seller", createAuthMiddleware(["seller"]), productController.getSellerProducts);

router.get("/:id", productController.getProductById);

module.exports = router;
