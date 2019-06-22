const mongoose = require("mongoose");
const Product = require("../models/product");
const User = require("../models/user");
// get products route controller

// get the index page
exports.getIndexPage = (req, res, next) => {
  Product.find()
    .then(productDoc => {
      res.status(201).render("shop/index", {
        pageTitle: "Shop",
        path: "/",
        products: productDoc,
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken(),
        user: req.user
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// get the cart page
exports.getCartPage = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
    isAuthenticated: req.session.isLoggedIn,
    user: req.user
  });
};

// exports.postCartDeleteItem = (req, res, next) => {

// }

exports.addToCart = (req, res, next) => {
  const productId = req.body.productId;
  User.findById(req.user._id)
    .then(user => {
      const cartProductIndex = user.cart.items.findIndex(
        item => item.productId.toString() === productId.toString()
      );
      console.log(cartProductIndex);

      let newQuantity = 1;

      if (cartProductIndex >= 0) {
        // product exists in cart so increment quantity
        user.cart.items[cartProductIndex].quantity += 1;
      } else {
        // product does not exists in cart so add product in cart
        user.cart.items.push({
          productId: productId,
          quantity: newQuantity
        });
      }

      return user.save();
    })
    .then(result => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
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

// get product details by passing id
exports.getProductById = (req, res, next) => {
  const productId = req.params.productId;
  //console.log(productId);
  Product.findById(productId)
    .then(product => {
      console.log("Product with given id found!");
      res.status(201).render("shop/product-details", {
        pageTitle: "Product Details",
        path: "/shop/product-details",
        product: product,
        isAuthenticated: req.session.isLoggedIn,
        user: req.user
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// get the about page
exports.getAboutPage = (req, res, next) => {
  res.render("shop/about", { pageTitle: "About", path: "/about" });
};
