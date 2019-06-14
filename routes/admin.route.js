const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

// /admin/add-product
router.get("/add-product", adminController.get_add_product_page);

// /admin/product
router.post("/product", adminController.post_add_product);

// /admin/products
router.get("/products", adminController.getProducts);

module.exports = router;
