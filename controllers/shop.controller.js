const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");

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

// BUY CART ITEMS
exports.postOrder = (req, res, next) => {
  // console.log(req.user.cart.item.productId._doc);
  User.findById(req.user._id)
    .populate("cart.items.productId")
    .then(user => {
      const products = user.cart.items.map(item => {
        return { product: { ...item.productId }, quantity: item.quantity };
      });

      if (user.cart.items.length < 1) {
        return res.redirect("/cart");
      }

      const order = new Order({
        products: products,
        user: {
          userId: req.user._id,
          name: req.user.name
        }
      });

      return order.save();
    })
    .then(result => {
      // clear the cart
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
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
  Order.find({ "user.userId": req.user._id })
    .then(orders => {
      if (!orders) {
        return res.render("shop/orders", {
          pageTitle: "Orders",
          path: "/orders",
          orders: [],
          user: req.user
        });
      }

      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
        user: req.user
      });
    })
    .catch(err => console.log(err));
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

// get invoice
exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  console.log(orderId);
  Order.findById(orderId)
    .then(orders => {
      if (!orders) {
        console.log("order does not exists");
        return res.redirect("/");
      }

      if (orders.user.userId.toString() !== req.user._id.toString()) {
        console.log("restricted");
        return res.redirect("/");
      }

      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      // create a pdf doc
      const pdfDoc = new PDFDocument();

      // set headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );

      // pipe it to write on invoicepath
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      // write pdf
      pdfDoc.fontSize(32).text("Invoice", {
        underline: true
      });

      pdfDoc.text("----------------------------");
      let totalAmount = 0;
      orders.products.forEach(product => {
        totalAmount += product.product.price * product.quantity;
        pdfDoc
          .fontSize(16)
          .text(
            product.product.name +
              "---------- (" +
              product.quantity +
              ") x" +
              product.product.price +
              "-----" +
              product.quantity * product.product.price
          );
      });
      pdfDoc
        .fontSize(24)
        .text("Total Amount" + "---------------------- $" + totalAmount);

      pdfDoc.end();
      console.log(orderId);
    })
    .catch(err => console.log(err));
};
