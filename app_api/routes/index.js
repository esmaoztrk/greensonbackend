const express = require("express");
const router = express.Router();
const ctrlProducts = require("../controllers/ProductController");
const ctrlComments = require("../controllers/CommentController");
const ctrlUsers = require("../controllers/UserController");
const ctrlBags = require("../controllers/BagController");

// Products Routes
router
  .route("/products")
  .post(ctrlProducts.createProduct)
  .get(ctrlProducts.getAllProducts);
router
  .route("/products/:productId")
  .get(ctrlProducts.getProductById)
  .put(ctrlProducts.updateProduct)
  .delete(ctrlProducts.deleteProduct);

// Comments Routes
router.route("/products/:productId/comments").post(ctrlComments.addComment);

router
  .route("/products/:productId/comments/:commentId")
  .get(ctrlComments.getComment)
  .put(ctrlComments.updateComment)
  .delete(ctrlComments.deleteComment);

// Admin Routes
router.route("/admin/products").get(ctrlProducts.getAllProducts);

router
  .route("/admin/products/:productId")
  .get(ctrlProducts.getProductById)
  .put(ctrlProducts.updateProduct);

router.route("/admin/products/new").post(ctrlProducts.createProduct);

// Login Route
router.route("/login").post(ctrlUsers.login);
router.route("/register").post(ctrlUsers.register);
 
//User Route
router.route("/users").get(ctrlUsers.getAllUsers);
router.route("/users/:userId").get(ctrlUsers.getUser);
router.route("/users/:userId/favorites").post(ctrlUsers.addFavorite);
router.route("/users/:userId/favorites").get(ctrlUsers.getFavorites);
router.route("/users/:userId/favorites").delete(ctrlUsers.removeFavorite);

//Bag Route

router.route("/bags").get(ctrlBags.getBags);
router.route("/addBag").post(ctrlBags.addBag);

module.exports = router;
