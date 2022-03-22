const { Supplier } = require("../modules/supplier");

exports.addSupplier = async (req, res) => {
  try {
    let supplier = await Supplier.findOne({ email: req.body.email });
    if (supplier) return res.status(400).send("Supplier Already Registered");

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
  } catch (error) {
    console.error("Error (Add Supplier) : \n", error);
    res.status(500).send(error);
  }
};

exports.getSuppliers = async function (req, res) {
  try {
    const suppliers = await Supplier.find({}, { name: 1, _id: 1 });

    if (suppliers?.length === 0)
      return res.status(404).send("No Suppliers Found");

    res.status(200).send(suppliers);
  } catch (error) {
    console.error("Error (Get Suppliers) : \n", error);
    res.status(500).send(error);
  }
};
