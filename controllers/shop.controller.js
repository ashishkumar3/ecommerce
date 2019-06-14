const Product = require("../models/product");
// get products route controller

// get the index page
exports.getIndexPage = (req, res, next) => {
  Product.find()
    .then(productDoc => {
      res.status(201).render("shop/index", {
        pageTitle: "Shop",
        path: "/",
        products: productDoc
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// get the cart page
exports.getCartPage = (req, res, next) => {
  res.render("shop/cart", { pageTitle: "Cart", path: "/cart" });
};

// get the checkout page
exports.getCheckoutPage = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout"
  });
};

exports.getOrdersPage = (req, res, next) => {
  res.render("shop/orders", { pageTitle: "Orders", path: "/orders" });
};
