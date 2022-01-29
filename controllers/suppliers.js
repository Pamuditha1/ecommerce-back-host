const { Supplier } = require("../modules/supplier");

exports.addSupplier = async (req, res) => {
  let supplier = await Supplier.findOne({ email: req.body.email });
  if (supplier) return res.status(400).send("Supplier Already Registered.");

  let newSupplier = new Supplier({
    name: req.body.name,
    email: req.body.email,
    nic: req.body.nic,
    contactMobile: req.body.contact1,
    contactOfficial: req.body.contact2,
    address: req.body.address,
  });

  await newSupplier.save();
  res.status(200).send("Successfully Registered the Supplier");

  return;
};

exports.getSuppliers = async function (req, res) {
  const suppliers = await Supplier.find({}, { name: 1, _id: 1 });

  res.status(200).send(suppliers);
};
