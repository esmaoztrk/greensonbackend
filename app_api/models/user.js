var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
  


var addressSchema = new mongoose.Schema({
  addressTitle: {type:String,required:true},
  addressLine: {type:String,required:true},
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },

});
// Define the user schema
var user = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  
  address:[addressSchema],

});


// Define a method to compare passwords
user.methods.comparePassword = async function(candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};


// Create the user model
mongoose.model("user", user, "users");



