const mongoose = require("mongoose");

const bag = new mongoose.Schema({
  userId: {type:Number  },
  productId: {type: String},
  productName: {type: String},
  price: {type: Number},
  amount: {type: Number},
});

// Create the user model
mongoose.model("bag", bag, "bags");



