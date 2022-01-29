const express = require("express");
const router = express.Router();
const { addSupplier, getSuppliers } = require("../controllers/suppliers");

router.post("/", addSupplier);

router.get("/", getSuppliers);

module.exports = router;
