const express = require("express");
const Joi = require("joi");
var multer = require("multer");
const router = express.Router();
const nodemailer = require("nodemailer");
const env = require("../envVariables");
const nodemailMailGun = require("nodemailer-mailgun-transport");
const invoiceHTML = require("../invoice/invoiceHTML");

const { Sale } = require("../modules/sales");
const { Product } = require("../modules/products");
const { Customer } = require("../modules/customerModule");

router.post("/", async (req, res) => {
  // console.log("Place Order", req.body)
  // res.send('Received')

  // const {error} = validateCustomer(req.body);
  // if(error) return res.status(400).send(error.details[0].message);

  const lastSale = await Sale.find()
    .sort({ _id: -1 })
    .limit(1)
    .select("orderNo");

  let newNo = "";
  if (lastSale.length != 0) {
    let lastNo = lastSale[0].orderNo;
    newNo = parseInt(lastNo) + 1;
  } else {
    newNo = 0;
  }

  let sale = new Sale({
    orderNo: newNo,
    customer: req.body.customer.id,
    status: "Ordered",
    products: req.body.cart,
    subtotal: req.body.subtotal,
    timeStamp: new Date().toISOString(),
  });
  // console.log(req.body.cart)
  const saleR = await sale.save();
  // console.log("Cart", req.body.cart[0])
  let customerR = {};

  Customer.findById(req.body.customer.id)
    .then((customer) => {
      customerR = customer;
      let proQty = 0;

      req.body.cart.forEach((i) => {
        proQty = proQty + parseInt(i.qty);
      });

      if (customer.qutyBought)
        customer.qutyBought = parseInt(customer.qutyBought) + parseInt(proQty);
      else customer.qutyBought = parseInt(req.body.cart.length);

      if (customer.orders) customer.orders = parseInt(customer.orders) + 1;
      else customer.orders = 1;

      return customer;
    })
    .then((c) => {
      c.save();
      sendInvoiceMail(
        customerR.email,
        saleR,
        customerR,
        req.body.cartComplete,
        req.body.subtotal
      );
    });

  req.body.cart.forEach((p) => {
    // const product = await Product.findById(p.id)
    Product.findById(p.id)
      .populate("supplierID")
      .then((product) => {
        // console.log("Printing Product",product)
        product.totalQuantity =
          parseInt(product.totalQuantity) - parseInt(p.qty);

        //send mails
        if (parseInt(product.totalQuantity) <= parseInt(product.rquantity)) {
          // console.log("T Qty", product.totalQuantity)
          // console.log("Reor Qty", product.rquantity)

          sendStockLowMail(product.supplierID.email, product);
        }

        if (product.sales)
          product.sales = parseInt(product.sales) + parseInt(p.qty);
        else {
          product.sales = parseInt(p.qty);
        }

        product.combinations.forEach((c) => {
          // console.log("C", c)
          // console.log("..size", p.size)
          if (c.size == p.size) c.qty = parseInt(c.qty) - parseInt(p.qty);
        });
        // console.log("Product after reduce sales", product)
        return product;
      })
      .then((product) => {
        if (product.salesCombinations) {
          let avaiSize = product.salesCombinations.filter((c) => {
            if (c.size == p.size) return true;
          });

          // console.log("Avai Size ", avaiSize)

          if (avaiSize.length > 0) {
            product.salesCombinations.forEach((c) => {
              // console.log("Combination Size", c.size)
              // console.log("Order Size", p.size)
              if (c.size == p.size) c.qty = parseInt(c.qty) + parseInt(p.qty);
            });
            // console.log("SalesComAvai",product)
          } else {
            product.salesCombinations.push({ size: p.size, qty: p.qty });
          }
        } else {
          let com = [];
          // com.push({ size: p.size , qty: p.qty })
          // console.log("Com", com)
          product.salesCombinations.push({ size: p.size, qty: p.qty });
          // console.log("SalesComNotAvai",product)
        }
        return product;
      })
      .then((product) => {
        product.save();
      });
  });

  // productR = await product.save();

  res.status(200).send(`Order Successfully Placed.`);

  console.log("Sale Result", saleR);
  // console.log("Product Result", productR)

  return;
});

let transporter = nodemailer.createTransport(nodemailMailGun(env.emailAuth));

// let mailContent={
//     from: 'thedini99.mit@gmail.com',
//     to: '',
//     subject: 'Item Reached Reorder Level',
//     text: '',
//     // html: '',
// };

function sendStockLowMail(email, product) {
  // console.log('Owner Email', email)

  let mailContent = {
    from: "thedini99.mit@gmail.com",
    to: "thediniwickramasinghe99@gmail.com",
    subject: "Item Reached Reorder Level",
    text: "",
  };

  // mailContent.to = "thediniwickramasinghe99@gmail.com";
  mailContent.text = `
                Item ${product.productNo} - ${product.productName} Reached Reorder Level

        Reorder Level - ${product.rquantity} 
        Available Total Quantity - ${product.totalQuantity}

        Thank You,
        Best Regards

    `;
  // console.log("Content", mailContent)
  transporter.sendMail(mailContent, function (error, data) {
    if (error) {
      console.log(`Unable to send mail to ${mailContent.to}`, error);
    } else {
      console.log(`Email send successfully to Admin - ${mailContent.to}`);
    }
  });
}

function sendInvoiceMail(email, sale, customer, cart, subtotal) {
  // console.log('Cus Email', email)

  let mailContent = {
    from: "thedini99.mit@gmail.com",
    to: email,
    subject: "Ninetees Collection Invoice",
    text: "",
    html: invoiceHTML(sale, customer, cart, subtotal),
  };

  // mailContent.to = email;
  // mailContent.subject = 'Ninetees Collection Invoice'

  // mailContent.html = invoiceHTML(sale, customer, cart, subtotal)
  // console.log("Content", mailContent)
  transporter.sendMail(mailContent, function (error, data) {
    if (error) {
      console.log(`Unable to send mail to ${email}`, error);
    } else {
      console.log(`Email send successfully to Customer - ${email}`);
    }
  });
}

module.exports = router;
