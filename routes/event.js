const express = require("express");
const router = express.Router();
const {
  addEvent,
  preprocessEvents,
  getTemporaryUserId,
  // updateEvents,
} = require("../controllers/event");

router.post("/", addEvent);

router.get("/user", getTemporaryUserId);

router.get("/", preprocessEvents);

// router.get("/update", updateEvents)

module.exports = router;
