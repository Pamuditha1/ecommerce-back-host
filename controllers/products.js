const { Product } = require("../modules/products");

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

exports.getAllProducts = async function (req, res) {
  const products = await Product.find({ $and: [{ totalQuantity }] });
  //   //get available products
  //   const products = await Product.find({});
  //   let availableProducts = products.filter((p) => {
  //     if (p.totalQuantity > 0) return true;
  //   });

  //   //filter most popular
  //   let popularF = availableProducts.filter((p) => {
  //     if (p.sales > 0) return true;
  //   });
  //   popularF.sort(compare);
  //   let popular = popularF.slice(0, 2);
  //   let popularIds = popular.map((p) => p._id);

  //   //set popular
  //   availableProducts.forEach((p) => {
  //     if (popularIds.includes(p._id)) return (p.popular = true);
  //   });

  //   res.status(200).send(availableProducts);
};

exports.getAllProductsAdmin = async function (req, res) {
  const products = await Product.find({}).populate("category");

  if (products?.length === 0) return res.status(404).send("No Products Found");

  // //filter most popular
  // let popularF = products.filter((p) => {
  //   if (p.sales > 0) return true;
  // });
  // popularF.sort(compare);
  // let popular = popularF.slice(0, 2);
  // let popularIds = popular.map((p) => p._id);

  // //set popular
  // products.forEach((p) => {
  //   if (popularIds.includes(p._id)) return (p.popular = true);
  // });

  res.status(200).send(products);
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
