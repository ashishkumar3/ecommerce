const Product = require("../models/product");
const { validationResult } = require("express-validator");
const fileHelper = require("../utils/file");

/*
 ************************GET ADD PRODUCT PAGE*************************
 */

exports.addProductPage = (req, res, next) => {
  console.log(req.user._id);
  res.status(200).render("admin/add-product", {
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

  let { name, price, description } = req.body;

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/add-product", {
      errors: errors.array(),
      path: "/admin/add-product",
      pageTitle: "Add Product",
      oldInputs: {
        name: name,
        description: description,
        price: price
      },
      isAuthenticated: req.session.isLoggedIn,
      user: req.user
    });
  }

  let image = req.file;
  console.log(image, "imageeeee");
  if (!image) {
    req.flash("error", "File should be an image");
    return res.status(422).render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      isAuthenticated: req.session.isLoggedIn,
      user: req.user
    });
  }

  const product = new Product({
    name: name,
    description: description,
    price: price,
    imageUrl: image.path,
    userId: req.user._id
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
      res.status(201).redirect("/admin/products");
    })
    .catch(err => {
      console.log("err", err);
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
        products: productDoc,
        user: req.user
      });
    })
    .catch(err => {
      console.log(err, "err");
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
        product: product,
        user: req.user
      });
    })
    .catch(err => {
      console.log(err, "err");
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
  const updatedImage = req.file;
  // const updatedImageUrl = req.file;
  console.log(updatedImageUrl);

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/add-product", {
      errors: errors.array(),
      path: "/admin/add-product",
      pageTitle: "Add Product",
      oldInputs: {
        name: name,
        description: description,
        price: price
      },
      isAuthenticated: req.session.isLoggedIn,
      user: req.user
    });
  }

  Product.findById(id)
    .then(product => {
      if (product.userId.toString() !== req.session.user._id.toString()) {
        return res.redirect("/");
      }

      if (updatedImage) {
        // delete the old image from server
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      product.name = updatedName;
      product.price = updatedPrice;
      product.description = updatedDescription;
      return product.save();
    })
    .then(result => {
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log("err", err);
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

  Product.findById(_id)
    .then(product => {
      if (!product) {
        return console.log("prod does not exists");
      }
      // delete the image
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: _id, userId: req.session.user._id });
    })
    .then(doc => {
      console.log(`Product with id ${_id} deleted from db.`);
      res.status(200).redirect("/admin/products");
    })
    .catch(err => {
      console.log("err", err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
