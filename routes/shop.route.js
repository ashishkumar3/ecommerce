const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop.controller");

router.get("/", shopController.getIndexPage);

// router.get('/products');
router.get("/cart", shopController.getCartPage);

router.post("/cart", shopController.addToCart);

router.get("/checkout", shopController.getCheckoutPage);

router.get("/orders", shopController.getOrdersPage);

// get about page
router.get("/about", shopController.getAboutPage);

router.get("/product/:productId", shopController.getProductById);

module.exports = router;
