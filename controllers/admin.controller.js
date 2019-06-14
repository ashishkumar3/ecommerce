const Product = require("../models/product");

// render add-product-page
exports.get_add_product_page = (req, res, next) => {
  res.render("admin/add-product", { pageTitle: "Add Product" });
};

// add the product to the shop database
exports.post_add_product = (req, res, next) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing.");
  }

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  });

  product
    .save()
    .then(productDoc => {
      if (!productDoc || productDoc.length === 0) {
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
