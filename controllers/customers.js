const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Customer } = require("../modules/customer");
const { Sale } = require("../modules/sales");

exports.registerCustomer = async (req, res) => {
  try {
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
      process.env.JWT
    );
    res
      .status(200)
      .json({ token, msg: "Successfully Registered the Customer" });

    return;
  } catch (error) {
    console.error("Error (Register Customer) : \n", error);
    res.status(500).send(error);
  }
};

exports.login = async (req, res) => {
  try {
    let customer = await Customer.findOne({ email: req.body.email });
    if (!customer) return res.status(400).send("Invalid Email");

    const validPassword = await bcrypt.compare(
      req.body.password,
      customer.password
    );
    if (!validPassword) res.status(400).send("Invalid Password");

    const token = jwt.sign(
      { _id: customer._id, type: customer.type, name: customer.username },
      process.env.JWT
    );
    res.status(200).json({
      token,
      msg: "Successfully Logged In",
    });
    return;
  } catch (error) {
    console.error("Error (Customer Login) : \n", error);
    res.status(500).send(error);
  }
};

exports.getAllCustomers = async function (req, res) {
  try {
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
  } catch (error) {
    console.error("Error (Get All Customer) : \n", error);
    res.status(500).send(error);
  }
};

exports.getCustomer = async function (req, res) {
  try {
    const customer = await Customer.findById(req.params.id).select("-password");

    if (!customer) return res.status(400).send("No Customer Found");

    res.send(customer);
  } catch (error) {
    console.error("Error (Get Customer) : \n", error);
    res.status(500).send(error);
  }
};
