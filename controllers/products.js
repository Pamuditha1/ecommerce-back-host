const { Product } = require("../modules/products");

exports.getNewProNo = async function (req, res) {
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
};

exports.addProduct = async (req, res) => {
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
    product.combinations.push({ size: req.body.size, qty: +req.body.quantity });

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
        parseInt(availableProduct.totalQuantity) + parseInt(req.body.quantity);
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

    res.status(200).send(`Product Sizes ${req.body.size} Successfully Updated`);
  }
};

exports.updateDiscount = async (req, res) => {
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
};

exports.updateProduct = async (req, res) => {
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
};

exports.removeImage = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(400).send("Invalid Image");

  product.image = "";

  await product.save();
  res.send(`Image Removed on Product ${product.productNo}`);
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("supplierID");

  res.status(200).send(product);
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.find({})
    .populate("category")
    .sort({ sales: -1 })
    .skip(5);

  const productsPopular = await Product.find()
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
};

exports.getDiscountedProducts = async (req, res) => {
  const discounted = await Product.find({ discount: { $ne: "0" } })
    .populate("category")
    .sort({ sales: -1 })
    .skip(5);

  const popularProducts = await Product.find({ discount: { $ne: "0" } })
    .populate("category")
    .sort({ sales: -1 })
    .limit(5);
  const popular = popularProducts.map((product) => {
    return { ...product._doc, popular: true };
  });

  const discountedProducts = [...discounted, ...popular];

  if (discountedProducts?.length === 0)
    return res.status(404).send("No Discounted Items Found");

  res.send(discountedProducts);
};

exports.getMostPopularProducts = async (req, res) => {
  const products = await Product.find()
    .populate("category")
    .sort({ sales: -1 })
    .limit(5);

  if (products?.length === 0)
    return res.status(404).send("No Popular Items Found");

  const popular = products.map((product) => {
    return { ...product._doc, popular: true };
  });
  res.send(popular);
};

exports.getSales = async function (req, res) {
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
};

exports.getInventory = async (req, res) => {
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
};
