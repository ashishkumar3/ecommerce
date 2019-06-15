const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop.controller");

router.get("/", shopController.getIndexPage);

// router.get('/products');
router.get("/cart", shopController.getCartPage);

router.get("/checkout", shopController.getCheckoutPage);

router.get("/orders", shopController.getOrdersPage);

router.get("/product/:productId", shopController.getProductById);

module.exports = router;
