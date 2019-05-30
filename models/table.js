// Table Schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Schema defines shape of the document within the collection
const tableSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  bookedUser: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

// Create a model of the schema
module.exports = mongoose.model("Table", tableSchema);
