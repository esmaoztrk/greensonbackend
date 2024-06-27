var mongoose = require("mongoose");

// Define the discount schema
var discount = new mongoose.Schema({
  type: { type: String, enum: ["percentage", "fixed"], required: true },
  value: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

// Define the comment schema
var comment = new mongoose.Schema({
  author: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// Define the product schema
var product = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  brand: { type: String, required: true },
  imageUrl: { type: String }, // imageUrl alanı
  href: { type: String },
  price: { type: Number },
  regularPrice: { type: Number },
  ratings: { type: Number },
  comments: [comment],
  discount: discount // Add the discount schema as a subdocument
});

// Create the product model
mongoose.model("product", product, "products");
