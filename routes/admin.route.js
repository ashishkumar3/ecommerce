const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const isAuthenticated = require("../middleware/is-auth");

const { check } = require("express-validator/check");

// /admin/add-product
router.get("/add-product", isAuthenticated, adminController.addProductPage);

// /admin/product
router.post("/add-product", isAuthenticated, adminController.postAddProduct);

// /admin/products
router.get("/products", isAuthenticated, adminController.getProducts);

// /admin/edit-products
router.get(
  "/edit-product/:productId",
  isAuthenticated,
  adminController.editProduct
);

router.post("/update-product", isAuthenticated, adminController.updateProduct);

router.post(
  "/delete-product",
  isAuthenticated,
  adminController.deleteProductById
);
// router.get('/edit-product', );

module.exports = router;
