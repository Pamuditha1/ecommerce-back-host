const nodemailer = require("nodemailer");
const nodemailMailGun = require("nodemailer-mailgun-transport");
const invoiceHTML = require("../../invoice/invoiceHTML");

const emailAuth = {
  auth: {
    api_key: process.env.MAIL_API,
    domain: process.env.MAIL_DOMAIN,
  },
};

let transporter = nodemailer.createTransport(nodemailMailGun(emailAuth));

exports.sendStockLowMail = (email, product) => {
  let mailContent = {
    from: "thedini99.mit@gmail.com",
    to: "thediniwickramasinghe99@gmail.com",
    subject: "Item Reached Reorder Level",
    text: "",
  };

  mailContent.text = `
                  Item ${product.productNo} - ${product.productName} Reached Reorder Level
  
          Reorder Level - ${product.rquantity} 
          Available Total Quantity - ${product.totalQuantity}
  
          Thank You,
          Best Regards
  
      `;
  transporter.sendMail(mailContent, function (error, data) {
    if (error) {
      console.log(`Unable to send mail to ${mailContent.to}`, error);
    } else {
      console.log(`Email send successfully to Admin - ${mailContent.to}`);
    }
  });
};

exports.sendInvoiceMail = (email, sale, customer, cart, subtotal) => {
  let mailContent = {
    from: "thedini99.mit@gmail.com",
    to: email,
    subject: "Ninetees Collection Invoice",
    text: "",
    html: invoiceHTML(sale, customer, cart, subtotal),
  };

  transporter.sendMail(mailContent, function (error, data) {
    if (error) {
      console.log(`Unable to send mail to ${email}`, error);
    } else {
      console.log(`Email send successfully to Customer - ${email}`);
    }
  });
};
