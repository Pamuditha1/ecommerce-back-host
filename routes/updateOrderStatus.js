const express = require("express");
const Joi = require("joi");
var multer = require("multer");
const router = express.Router();

const { Sale } = require("../modules/sales");
const { Product } = require("../modules/products");

router.get("/:id", async function (req, res) {
  const result = await Sale.updateOne(
    { orderNo: req.params.id },
    {
      $set: {
        status: "Delivered",
      },
    }
  );
  if (res) {
    console.log("Found product for image", result);
    res.status(200).send(`Order ${req.params.id} Delivered`);
  }
});

module.exports = router;
