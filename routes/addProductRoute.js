const express = require("express");
const Joi = require("joi");
var multer = require("multer");
const router = express.Router();
const authCustomer = require("../middleware/authMiddleware");

const { Product } = require("../modules/products");

router.post("/update", async (req, res) => {
  //check for current item

  let product = await Product.findOne({ productNo: req.body.productNo });
  console.log("Before product", product);
  product.productName = req.body.productName;
  product.description = req.body.description;
  product.supplierID = req.body.supplier;
  product.material = req.body.material;
  product.color = req.body.color;
  product.price = req.body.price;
  product.bprice = req.body.bprice;
  product.rquantity = req.body.rquantity;
  product.profit = req.body.profit;
  product.profitP = req.body.profitP;
  product.category = req.body.category;
  product.popular = false;

  console.log("After product", product);

  //check for size availability

  let avaiSize = product.combinations.filter((c) => {
    if (c.size == req.body.size) return true;
  });
  console.log("avai size", avaiSize);

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

  product.combinations.push({ size: req.body.size, qty: req.body.quantity });
  product.totalQuantity =
    parseInt(product.totalQuantity) + parseInt(req.body.quantity);
  console.log("After", product);
  await product.save();
  res.status(200).send(`Product Sizes ${req.body.size} Successfully Updated`);
});

var fileToDB = "";
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `productImages`);
  },

  filename: function (req, file, cb) {
    const fileType = file.originalname.split(".")[1];
    fileToDB = req.headers.nameofimage + "." + fileType;

    cb(null, req.headers.nameofimage + "." + fileType);
  },
});

var upload = multer({ storage: storage }).single("file");

router.post("/image", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500).json(err);
    } else if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    addImage(req, res);
  });
});

async function addImage(req, res) {
  console.log("name of image", req.headers.nameofimage);
  const result = await Product.updateOne(
    { productNo: req.headers.nameofimage },
    {
      $set: {
        image: fileToDB,
      },
    }
  );
  if (res) console.log("Found product for image", result);
  res.status(200).send("Image Successfully Saved");
}

module.exports = router;
