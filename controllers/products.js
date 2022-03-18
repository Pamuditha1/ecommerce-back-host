const { Category } = require("../modules/category");
const { Product } = require("../modules/products");
const ObjectId = require("mongodb").ObjectId;

exports.getNewProNo = async function (req, res) {
  try {
    const products = await Product.find()
      .sort({ _id: -1 })
      .limit(1)
      .select("productNo");

    let newNo = 1;

    if (products.length != 0) {
      let proNo = products[0].productNo.substring(1);
      newNo = parseInt(proNo) + 1;
    }

    res.send(newNo.toString());
  } catch (error) {
    console.error("Error (Get Product No) : \n", error);
    res.status(500).send(error);
  }
};

exports.addProduct = async (req, res) => {
  try {
    let availableProduct = await Product.findOne({
      productNo: req.body.productNo,
    });

    if (!availableProduct) {
      //add new item if not available

      let product = new Product({
        productNo: req.body.productNo,
        productName: req.body.productName,
        description: req.body.description,
        supplierID: req.body.supplier,
        image: req.body.image,
        material: req.body.material,
        color: req.body.color,
        price: +req.body.price,
        bprice: +req.body.bprice,
        rquantity: +req.body.rquantity,
        profit: +req.body.profit,
        profitP: +req.body.profitP,
        category: req.body.category,
        totalQuantity: +req.body.quantity,
        salesCombinations: [],
        barcode: req.body.barcode,
      });
      product.combinations.push({
        size: req.body.size,
        qty: +req.body.quantity,
      });

      await product.save();
      return res.send(`Product Size ${req.body.size} Successfully Saved `);
    } else {
      //update product data

      let avaiSize = availableProduct.combinations.filter((c) => {
        if (c.size == req.body.size) return true;
      });

      if (avaiSize.length > 0) {
        availableProduct.combinations.forEach((p) => {
          if (p.size == req.body.size)
            p.qty = parseInt(p.qty) + parseInt(req.body.quantity);
        });
        availableProduct.totalQuantity =
          parseInt(availableProduct.totalQuantity) +
          parseInt(req.body.quantity);
        availableProduct.save();

        res
          .status(201)
          .send(`Product Size ${req.body.size} Quantity Successfully Updated`);
        return;
      }

      availableProduct.combinations.push({
        size: req.body.size,
        qty: +req.body.quantity,
      });
      availableProduct.totalQuantity =
        parseInt(availableProduct.totalQuantity) + parseInt(req.body.quantity);

      availableProduct.save();

      res
        .status(200)
        .send(`Product Sizes ${req.body.size} Successfully Updated`);
    }
  } catch (error) {
    console.error("Error (Add Product) : \n", error);
    res.status(500).send(error);
  }
};

exports.updateDiscount = async (req, res) => {
  try {
    let product = await Product.findById(req.body.id);
    if (!product) return res.status(400).send("Invalid Product");

    product.discount = req.body.discount;
    if (product.discount.includes("%")) {
      product.discountedPrice =
        parseInt(product.price) -
        (parseInt(product.price) * parseInt(req.body.discount.slice(0, -1))) /
          100;
    } else {
      product.discountedPrice =
        parseInt(product.price) - parseInt(req.body.discount);
    }
    await product.save();

    if (req.body.discount == 0) {
      return res.status(200).send("Discount Removed");
    }
    res.send("Discount Updated");

    return;
  } catch (error) {
    console.error("Error (Update Discount) : \n", error);
    res.status(500).send(error);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findOne({ productNo: req.body.productNo });
    if (!product) return res.status(400).send("Product Not Found");

    product.productName = req.body.productName;
    product.description = req.body.description;
    product.supplierID = req.body.supplier;
    product.material = req.body.material;
    product.color = req.body.color;
    product.price = +req.body.price;
    product.bprice = +req.body.bprice;
    product.rquantity = +req.body.rquantity;
    product.profit = +req.body.profit;
    product.profitP = req.body.profitP;
    product.category = req.body.category;
    product.image = req.body.image;

    //check for size availability
    let avaiSize = product.combinations.filter((c) => {
      if (c.size == req.body.size) return true;
    });

    if (avaiSize.length > 0) {
      //update current size
      product.combinations.forEach((p) => {
        if (p.size == req.body.size)
          p.qty = parseInt(p.qty) + parseInt(req.body.quantity);
      });
      product.totalQuantity =
        parseInt(product.totalQuantity) + parseInt(req.body.quantity);
      product.save();

      res
        .status(200)
        .send(`Product Size ${req.body.size} Quantity Successfully Updated`);
      return;
    }

    //add new size
    product.combinations.push({ size: req.body.size, qty: +req.body.quantity });
    product.totalQuantity =
      parseInt(product.totalQuantity) + parseInt(req.body.quantity);

    await product.save();
    res.send(`Product Sizes ${req.body.size} Successfully Updated`);
  } catch (error) {
    console.error("Error (Update Product) : \n", error);
    res.status(500).send(error);
  }
};

exports.removeImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send("Invalid Image");

    product.image = "";

    await product.save();
    res.send(`Image Removed on Product ${product.productNo}`);
  } catch (error) {
    console.error("Error (Remove Product Image) : \n", error);
    res.status(500).send(error);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "supplierID"
    );
    if (!product) return res.status(400).send("Invalid Product");

    res.status(200).send(product);
  } catch (error) {
    console.error("Error (Get Product) : \n", error);
    res.status(500).send(error);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ visible: true })
      .populate("category")
      .sort({ sales: -1 })
      .skip(5);

    const productsPopular = await Product.find({ visible: true })
      .populate("category")
      .sort({ sales: -1 })
      .limit(5);

    const popular = productsPopular.map((product) => {
      return { ...product._doc, popular: true };
    });

    const allProducts = [...products, ...popular];

    if (allProducts?.length === 0)
      return res.status(404).send("No Products Found");

    res.status(200).send(allProducts);
  } catch (error) {
    console.error("Error (Get All Products) : \n", error);
    res.status(500).send(error);
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findOne({ name: categoryId });

    if (!category) return res.status(400).send("Invalid Category");

    const products = await Product.find({
      visible: true,
      category: category._id,
    })
      .populate("category")
      .sort({ sales: -1 })
      .skip(5);

    const productsPopular = await Product.find({
      visible: true,
      category: category._id,
    })
      .populate("category")
      .sort({ sales: -1 })
      .limit(5);

    const popular = productsPopular.map((product) => {
      return { ...product._doc, popular: true };
    });

    const allProducts = [...products, ...popular];

    if (allProducts?.length === 0)
      return res.status(404).send("No Products Found");

    res.status(200).send(allProducts);
  } catch (error) {
    console.error("Error (Get Products by Category) : \n", error);
    res.status(500).send(error);
  }
};

exports.getDiscountedProducts = async (req, res) => {
  try {
    const discounted = await Product.find({
      visible: true,
      discount: { $ne: "0" },
    })
      .populate("category")
      .sort({ sales: -1 });
    // .skip(4);

    // const popularProducts = await Product.find({
    //   visible: true,
    //   discount: { $ne: "0" },
    // })
    //   .populate("category")
    //   .sort({ sales: -1 })
    //   .limit(4);

    // const popular = popularProducts
    //   .map((product) => {
    //     return { ...product._doc, popular: true };
    //   })
    //   .filter((product) => product.discount != "0");

    const discountedProducts = [
      ...discounted,
      // , ...popular
    ];

    if (discountedProducts?.length === 0)
      return res.status(404).send("No Discounted Items Found");

    res.send(discountedProducts.slice(1, 5));
  } catch (error) {
    console.error("Error (Get Discounted Products) : \n", error);
    res.status(500).send(error);
  }
};

exports.getMostPopularProducts = async (req, res) => {
  try {
    const products = await Product.find({ visible: true })
      .populate("category")
      .sort({ sales: -1 })
      .limit(4);

    if (products?.length === 0)
      return res.status(404).send("No Popular Items Found");

    const popular = products.map((product) => {
      return { ...product._doc, popular: true };
    });
    res.send(popular);
  } catch (error) {
    console.error("Error (Get Popular Products) : \n", error);
    res.status(500).send(error);
  }
};

exports.getSales = async function (req, res) {
  try {
    const products = await Product.find(
      {},
      {
        productNo: 1,
        productName: 1,
        category: 1,
        sales: 1,
        salesCombinations: 1,
      }
    ).populate("category");

    res.status(200).send(products);
  } catch (error) {
    console.error("Error (Get Sales) : \n", error);
    res.status(500).send(error);
  }
};

exports.getInventory = async (req, res) => {
  try {
    const products = await Product.find(
      {},
      {
        productNo: 1,
        productName: 1,
        category: 1,
        totalQuantity: 1,
        combinations: 1,
        supplierID: 1,
        barcode: 1,
      }
    ).populate("category");

    res.status(200).send(products);
  } catch (error) {
    console.error("Error (Get Inventory) : \n", error);
    res.status(500).send(error);
  }
};

exports.hideProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) return res.status(404).send("No Item Found");

    product.visible = false;
    await product.save();

    res.status(200).send("Item Successfully Removed");
  } catch (error) {
    console.error("Error (Hide Product) : \n", error);
    res.status(500).send(error);
  }
};
