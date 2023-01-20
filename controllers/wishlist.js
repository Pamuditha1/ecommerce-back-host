const { Wishlist } = require("../modules/wishlist");

exports.updateWishlist = async (req, res) => {
  try {
    let wish = await Wishlist.findOne({
      userId: req.body.userId,
      productId: req.body.productId,
    });

    let msg;
    if (wish) {
      await Wishlist.findByIdAndRemove(wish._id);
      msg = "Removed from the wishlist";
    } else {
      let newWish = new Wishlist(req.body);
      await newWish.save();
      msg = "Added to the Wishlist";
    }

    const wishes = await Wishlist.find({ userId: req.body.userId }).populate(
      "productId"
    );
    res.status(200).json({ data: wishes, msg });

    return;
  } catch (error) {
    console.error("Error (Add Wish) : \n", error);
    res.status(500).send(error);
  }
};

exports.getWishProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).send("Invalid User Id");

    const wishes = await Wishlist.find({ userId: id }).populate("productId");
    if (wishes?.length === 0)
      return res.status(404).send("No wishlist for the user");

    res.status(200).send(wishes);
  } catch (error) {
    console.error("Error (Get Wishes) : \n", error);
    res.status(500).send(error);
  }
};
