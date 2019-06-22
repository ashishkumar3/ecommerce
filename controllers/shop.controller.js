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
  User.findById(req.user._id)
    .populate("cart.items.productId")
    .then(user => {
      // user.cart.items.map(a => console.log(a));
      console.log(user.cart.items);

      if (!user) {
        return res.redirect("/");
      }
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        cartItems: user.cart.items,
        user: req.user
      });
    })
    .catch(err => console.log(err));
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

// delete from cart
exports.postDeleteCartProduct = (req, res, next) => {
  let productId = req.body.productId;

  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        res.redirect("/");
      }

      const updatedCartItems = user.cart.items.filter(
        item => item.productId.toString() !== productId.toString()
      );
      user.cart.items = updatedCartItems;
      user.save();
      // if(user.cart.items[cartProductIndex].quantity >= 0){
      //   user.cart.items[cartProductIndex].quantity =- 1;
      // }else{

      // }
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
