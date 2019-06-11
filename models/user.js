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
  orderedItems: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item"
    }
  ]
});

// Create model of the user schema
module.exports = mongoose.model("User", userSchema);
