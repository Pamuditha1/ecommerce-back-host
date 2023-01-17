const { Event } = require("../modules/event");

exports.addEvent = async (req, res) => {
  try {
    let newEvent = new Event(req.body);

    const saved = await newEvent.save();
    res.status(200).send("Event Added " + saved._id);

    return;
  } catch (error) {
    console.error("Error (Add Event) : \n", error);
    res.status(500).send(error);
  }
};
