const Product = require("../models/product");
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
        csrfToken: req.csrfToken()
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// get the cart page
exports.getCartPage = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
    isAuthenticated: req.session.isLoggedIn
  });
};

// exports.postCartDeleteItem = (req, res, next) => {

// }

exports.addToCart = (req, res, next) => {
  const productId = req.body.productId;
  console.log("product added to cart", productId);
  res.redirect("/");
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
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// get the about page
exports.getAboutPage = (req, res, next) => {
  res.render("shop/about", { pageTitle: "About", path: "/about" });
};
