const express = require("express");
const router = express.Router();
const {
  addEvent,
  preprocessEvents,
  getTemporaryUserId,
} = require("../controllers/event");

router.post("/", addEvent);

router.get("/user", getTemporaryUserId);

router.get("/", preprocessEvents);

module.exports = router;
