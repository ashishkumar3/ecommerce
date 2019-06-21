const Product = require("../models/product");

/*
 ************************GET ADD PRODUCT PAGE*************************
 */

exports.addProductPage = (req, res, next) => {
  console.log(req.session.user._id);
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    isAuthenticated: req.session.isLoggedIn,
    user: req.user
  });
};

/*
 ************************ADD THE PRODUCT TO THE SHOP AS SELLER*************************
 */

exports.postAddProduct = (req, res, next) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing.");
  }

  let { name, price, description, imageUrl } = req.body;

  console.log(req.body);

  let errors = [];

  const product = new Product({
    name: name,
    description: description,
    price: price,
    imageUrl: imageUrl,
    userId: req.session.user._id
  });

  product
    .save()
    .then(productDoc => {
      if (!productDoc || productDoc.length === 0) {
        console.log("mongo error nothing returned");
        return res.status(500).send(productDoc);
      }
      req.flash("success_msg", "New product added");
      console.log(productDoc);
      res.status(201).redirect("/");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

/*
 ************************GET ALL ADMIN PRODUCTS PAGE*************************
 */

exports.getProducts = (req, res, next) => {
  // show only those products which are added by the logged in user.
  // const userId = req.session.user._id;

  Product.find({ userId: req.session.user._id })
    .then(productDoc => {
      console.log(productDoc);
      console.log(typeof req.session.user._id);
      res.status(201).render("admin/products", {
        pageTitle: "Products",
        path: "/admin/products",
        products: productDoc
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

/*
 ************************GET EDIT PRODUCT PAGE*************************
 */

exports.editProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then(product => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        product: product
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

/*
 ************************POST EDIT A PRODUCT*************************
 */

exports.updateProduct = (req, res, next) => {
  const id = req.body.productId;
  const updatedName = req.body.name;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedImageUrl = req.body.imageUrl;

  Product.findById(id)
    .then(product => {
      if (product.userId.toString() !== req.session.user._id.toString()) {
        return res.redirect("/");
      }
      product.name = updatedName;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      res.redirect("/admin/products");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

/*
 ************************DELETE A PRODUCT*************************
 */

exports.deleteProductById = (req, res) => {
  if (!req.body.productId) {
    return res.status(400).send("Missing body parameter: productId");
  }

  let _id = req.body.productId;
  console.log(_id);

  Product.deleteOne({ _id: _id, userId: req.session.user._id })
    .then(doc => {
      console.log(`Product with id ${_id} deleted from db.`);
      res.status(200).redirect("/admin/products");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
