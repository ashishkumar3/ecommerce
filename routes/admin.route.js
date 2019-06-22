const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const isAuthenticated = require("../middleware/is-auth");

const { check } = require("express-validator/check");

// /admin/add-product
router.get("/add-product", isAuthenticated, adminController.addProductPage);

// /admin/product
router.post(
  "/add-product",
  [
    check("name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Name should be atleast 3 characters long."),
    check("price")
      .isNumeric()
      .withMessage("Price should be a number"),
    check("description")
      .trim()
      .isLength({ min: 8, max: 400 })
      .withMessage("Description should be between 8 and 400 characters.")
  ],
  isAuthenticated,
  adminController.postAddProduct
);

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

module.exports = router;
