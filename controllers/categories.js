const { Category } = require("../modules/category");

exports.addCategory = async (req, res) => {
  let category = await Category.findOne({ name: req.body.name });
  if (category) return res.status(400).send("Category Already Available");

  let newCategory = new Category(req.body);

  await newCategory.save();
  res.status(200).send("Category Added Successfully");

  return;
};

exports.updateCategory = async (req, res) => {
  let category = await Category.findById(req.params.id);
  if (!category) return res.status(400).send("Invalid Category");

  category.name = req.body.name;

  await category.save();
  res.status(200).send("Category Updated Successfully");

  return;
};

exports.getCategories = async (req, res) => {
  let categories = await Category.find({});
  if (categories?.length === 0)
    return res.status(404).send("No Categories Found");

  res.send(categories);

  return;
};
