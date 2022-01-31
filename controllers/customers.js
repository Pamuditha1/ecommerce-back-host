const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../envVariables");

const { Customer } = require("../modules/customer");
const { Sale } = require("../modules/sales");

exports.registerCustomer = async (req, res) => {
  let customer = await Customer.findOne({ email: req.body.email });
  if (customer) return res.status(400).send("Customer Already Registered.");

  let newCustomer = new Customer({
    username: req.body.name,
    email: req.body.email,
    contactNo: req.body.contact,
    address: req.body.address,
    password: req.body.password,
    type: "Customer",
    district: req.body.district,
    province: req.body.province,
    dob: req.body.dob,
  });
  const salt = await bcrypt.genSalt(10);
  newCustomer.password = await bcrypt.hash(newCustomer.password, salt);

  await newCustomer.save();
  const token = jwt.sign(
    {
      _id: newCustomer._id,
      type: newCustomer.type,
      name: newCustomer.username,
    },
    env.jewtKey
  );
  res.status(200).json({ token, msg: "Successfully Registered the Customer" });

  return;
};

exports.login = async (req, res) => {
  let customer = await Customer.findOne({ email: req.body.email });
  if (!customer) return res.status(400).send("Invalid Email");

  const validPassword = await bcrypt.compare(
    req.body.password,
    customer.password
  );
  if (!validPassword) res.status(400).send("Invalid Password");

  const token = jwt.sign(
    { _id: customer._id, type: customer.type, name: customer.username },
    env.jewtKey
  );
  res.status(200).json({
    token,
    msg: "Successfully Logged In",
  });
  return;
};

exports.getAllCustomers = async function (req, res) {
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
  res.status(200).send(customers);
};

exports.getCustomer = async function (req, res) {
  const customer = await Customer.findById(req.params.id).select("-password");

  if (!customer) return res.status(400).send("No Customer Found");

  res.send(customer);
};
