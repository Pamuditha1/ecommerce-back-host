const { User } = require("../modules/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../envVariables");

exports.registerUser = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User Already Registered.");

  let newUser = new User({
    username: req.body.username,
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

  const token = jwt.sign(
    { _id: newUser._id, type: newUser.type, name: newUser.username },
    env.jewtKey
  );
  res.status(200).send("Successfully Registered the User");

  return;
};
