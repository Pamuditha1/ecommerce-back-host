const { Category } = require("../modules/category");

exports.addCategory = async (req, res) => {
  try {
    let category = await Category.findOne({ name: req.body.name });
    if (category) return res.status(400).send("Category Already Available");

    let newCategory = new Category(req.body);

    await newCategory.save();
    res.status(200).send("Category Added Successfully");

    return;
  } catch (error) {
    console.error("Error (Add Category) : \n", error);
    res.status(500).send(error);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).send("Invalid Id");

    let category = await Category.findById(id);
    if (!category) return res.status(404).send("No Category Found");

    category.name = req.body.name;

    await category.save();
    res.status(200).send("Category Updated Successfully");

    return;
  } catch (error) {
    console.error("Error (Update Category) : \n", error);
    res.status(500).send(error);
  }
};

exports.getCategories = async (req, res) => {
  try {
    let categories = await Category.find({});
    if (categories?.length === 0)
      return res.status(404).send("No Categories Found");

    res.send(categories);

    return;
  } catch (error) {
    console.error("Error (Get Categories) : \n", error);
    res.status(500).send(error);
  }
};
