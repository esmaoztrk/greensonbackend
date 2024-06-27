// Import the Product model
var mongoose = require("mongoose");
var Product = mongoose.model("product");

// Create a response helper function
const sendResponse = function (res, status, content) {
  res.status(status).json(content);
};

// Retrieve all products
exports.getAllProducts = async function (req, res) {
  try {
    const products = await Product.find().populate("comments");
    sendResponse(res, 200, products);
  } catch (error) {
    sendResponse(res, 500, { status: "Sunucu hatası" });
  }
};

// Create a new product
exports.createProduct = async function (req, res) {
  try {
    const { name, brand,rating, imageUrl, href, price, regularPrice, ratings, comments, discount } = req.body;

    const newProduct = new Product({
      name,
      brand,
      imageUrl,
      rating,
      href,
      price,
      regularPrice,
      ratings,
      comments,
      discount
    });

    const savedProduct = await newProduct.save();
    sendResponse(res, 201, savedProduct);
  } catch (error) {
    sendResponse(res, 400, { status: error.message });
    console.log(error);
  }
};

// Retrieve a product by ID
exports.getProductById = async function (req, res) {
  try {
    const product = await Product.findById(req.params.productId).populate("comments");
    sendResponse(res, 200, product);
  } catch (error) {
    sendResponse(res, 404, { status: "Böyle bir mekan yok" });
  }
};

// Update a product
exports.updateProduct = async function (req, res) {
  try {
    const { name, brand, imageUrl, href, price, regularPrice, ratings, comments, discount } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, {
      name,
      brand,
      imageUrl,
      href,
      price,
      regularPrice,
      ratings,
      comments,
      discount
    }, { new: true });

    sendResponse(res, 200, updatedProduct);
  } catch (error) {
    sendResponse(res, 400, { status: error });
  }
};

// Delete a product
exports.deleteProduct = async function (req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    sendResponse(res, 200, { status: `${product.name} isimli mekan Silindi` });
  } catch (error) {
    sendResponse(res, 404, { status: "Böyle bir mekan yok!" });
  }
};

