const { Wishlist } = require("../modules/wishlist");

exports.addWishProduct = async (req, res) => {
  try {
    let newWish = new Wishlist(req.body);

    const saved = await newWish.save();
    res.status(200).send("Wish Added " + saved._id);

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

    const wishes = await Wishlist.find({ userId: id });
    if (wishes?.length === 0)
      return res.status(404).send("No wishlist for the user");

    res.status(200).send(wishes);
  } catch (error) {
    console.error("Error (Get Wishes) : \n", error);
    res.status(500).send(error);
  }
};
