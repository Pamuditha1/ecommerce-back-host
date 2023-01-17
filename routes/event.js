const express = require("express");
const router = express.Router();
const { addEvent } = require("../controllers/event");

router.post("/", addEvent);

module.exports = router;
