// User Schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Shape of User document.
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

// METHODS

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

// Create model of the user schema
module.exports = mongoose.model("User", userSchema);
