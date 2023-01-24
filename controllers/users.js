const { User } = require("../modules/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User Already Registered");

    let newUser = new User({
      username: req.body.username,
      dob: req.body.dob,
      email: req.body.email,
      contactNo: req.body.contactNo,
      contactNo2: req.body.contactNo2,
      nic: req.body.nic,
      address: req.body.address,
      password: req.body.password,
      type: req.body.type,
    });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();

    res.status(200).send("Successfully Registered the User");

    return;
  } catch (error) {
    console.error("Error (Register User) : \n", error);
    res.status(500).send(error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid Email");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).send("Invalid Password");

    const token = jwt.sign(
      { _id: user._id, type: user.type, name: user.username },
      process.env.JWT
    );
    res.status(200).json({
      token,
      msg: "Logged In Successfully",
      type: user.type,
    });
    return;
  } catch (error) {
    console.error("Error (User Login) : \n", error);
    res.status(500).send(error);
  }
};
