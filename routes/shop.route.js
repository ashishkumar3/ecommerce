const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop.controller");
const isAuthenticated = require("../middleware/is-auth");

router.get("/", shopController.getIndexPage);

// router.get('/products');
router.get("/cart", isAuthenticated, shopController.getCartPage);

router.post("/cart", isAuthenticated, shopController.addToCart);

router.post(
  "/delete-from-cart",
  isAuthenticated,
  shopController.postDeleteCartProduct
);

router.post("/post-order", isAuthenticated, shopController.postOrder);

router.get("/checkout", isAuthenticated, shopController.getCheckoutPage);

router.get("/orders", isAuthenticated, shopController.getOrdersPage);

// get about page
router.get("/about", shopController.getAboutPage);

// check product details
router.get("/product/:productId", shopController.getProductById);

// router.post('/cart-delete-item');

module.exports = router;
