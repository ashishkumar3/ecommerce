const Product = require("../models/product");

// render add-product-page
exports.get_add_product_page = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product"
  });
};

// add the product to the shop database
exports.post_add_product = (req, res, next) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing.");
  }

  let { name, price, description, imageUrl } = req.body;

  console.log(req.body);

  let errors = [];
  // form validations
  // if (!name || !price || !description || imageUrl) {
  //   errors.push({ msg: "Please fill in all the fields" });
  //   console.log("fields not filled.");
  //   return res.status(409).render("admin/add-product", {
  //     errors: errors,
  //     path: "/admin/add-product"
  //   });
  // }

  const product = new Product({
    name: name,
    description: description,
    price: price,
    imageUrl: imageUrl
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
      console.log(err);
      res.status(500).json(err);
    });
};

// get all products from the shop database
exports.getProducts = (req, res, next) => {
  Product.find()
    .then(productDoc => {
      res.status(201).render("admin/products", {
        pageTitle: "Products",
        path: "/admin/products",
        products: productDoc
      });
    })
    .catch(err => {
      console.log(err);
    });
};
