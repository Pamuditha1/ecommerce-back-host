const express = require("express");
const Joi = require("joi");
const router = express.Router();

const { Customer } = require("../modules/customerModule");
const { Sale } = require("../modules/sales");

router.get("/", async function (req, res) {
  // const customers = await Customer.find({},
  //     {
  //         password: 0,
  //     }
  // )

  // res.status(200).send(customers)

  const customers = await Customer.find(
    {},
    {
      password: 0,
      type: 0,
      __v: 0,
    }
  );
  customers.forEach((c) => {
    Sale.find({ customer: c._id }).then((s) => {
      c.qutyBought = s.length;
    });
  });
  // console.log(cus)
  res.status(200).send(customers);
});

module.exports = router;
