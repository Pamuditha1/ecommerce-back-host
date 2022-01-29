const { Sale } = require("../modules/sales");

exports.placeOrder = async (req, res) => {
  const lastSale = await Sale.find()
    .sort({ _id: -1 })
    .limit(1)
    .select("orderNo");

  let newNo = 0;
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
  const saleR = await sale.save();
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
    Product.findById(p.id)
      .populate("supplierID")
      .then((product) => {
        product.totalQuantity =
          parseInt(product.totalQuantity) - parseInt(p.qty);

        //send mails
        if (parseInt(product.totalQuantity) <= parseInt(product.rquantity)) {
          sendStockLowMail(product.supplierID.email, product);
        }

        if (product.sales)
          product.sales = parseInt(product.sales) + parseInt(p.qty);
        else {
          product.sales = parseInt(p.qty);
        }

        product.combinations.forEach((c) => {
          if (c.size == p.size) c.qty = parseInt(c.qty) - parseInt(p.qty);
        });
        return product;
      })
      .then((product) => {
        if (product.salesCombinations) {
          let avaiSize = product.salesCombinations.filter((c) => {
            if (c.size == p.size) return true;
          });

          if (avaiSize.length > 0) {
            product.salesCombinations.forEach((c) => {
              if (c.size == p.size) c.qty = parseInt(c.qty) + parseInt(p.qty);
            });
          } else {
            product.salesCombinations.push({ size: p.size, qty: p.qty });
          }
        } else {
          product.salesCombinations.push({ size: p.size, qty: p.qty });
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
};
