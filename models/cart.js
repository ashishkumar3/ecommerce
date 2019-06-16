const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  products: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },
  totalPrice: {
    type: Number
  }
});

module.exports = mongoose.model("Cart", cartSchema);
