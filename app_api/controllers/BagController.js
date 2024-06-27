var mongoose = require("mongoose");
var User = mongoose.model("user");
var Bag = mongoose.model("bag");

exports.getBags = async function (req, res) {
  try {
    const bags = await Bag.find();
    res.status(200).json(bags);
  } catch (error) {
    res.status(400).json({ message: "Bag Error", error });
  }
};

exports.addBag = async function (req, res) {
  const { product, amount } = req.body;

  try {
    let bagItem = await Bag.findOne({
      productId: product.productId ?? product._id,
    });
    if (bagItem == null || bagItem._id == null) {
      const newBag = new Bag({
        userId: 1,
        productId: product.productId ?? product._id,
        productName: product.name ?? product.productName,
        price: product.price,
        amount: 1,
      });

      newBag.save();

      res.status(201).json(newBag);
    } else {
      bagItem.amount += amount;
      if (bagItem.amount <= 0) {
        await Bag.findByIdAndDelete({ _id: bagItem._id });
        res.status(200).json({ message: "Bag silindi" });
      } else {
        const createdBag = await Bag.updateOne(
          { _id: bagItem._id },
          { amount: bagItem.amount }
        );
        res.status(201).json(createdBag);
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Bag Error", error });
  }
};
