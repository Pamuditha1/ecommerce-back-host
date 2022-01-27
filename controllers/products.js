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
