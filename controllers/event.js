const { Event } = require("../modules/event");
const mongoose = require("mongoose");
const { PreprocessedEvent } = require("../modules/preprocessed_event");

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

exports.getTemporaryUserId = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId();

    res.status(200).send(userId);

    return;
  } catch (error) {
    console.error("Error (Add Event) : \n", error);
    res.status(500).send(error);
  }
};

exports.preprocessEvents = async (req, res) => {
  try {
    const allEvents = await Event.find();
    let processedCount = 0;

    for (const event of allEvents) {
      let newEvent;
      newEvent = {
        productId: event.productId,
        userId: event.userId,
        isDiscounted: event.isDiscounted ? 1 : 0,
        isLoggedUser: event.isLoggedUser ? 1 : 0,
        userAgeGroup: event.userAgeGroup,
        season: event.season,
      };

      const preprocessedEvent = await PreprocessedEvent.findOne({
        userId: event.userId,
        productId: event.productId,
      });

      if (!preprocessedEvent) {
        const otherEvents = await Event.find({
          userId: event.userId,
          productId: event.productId,
        });

        if (otherEvents && otherEvents.length > 0) {
          let hoveredDuration = 0;
          let viewedDuration = 0;

          for (const otherEvent of otherEvents) {
            // if (otherEvent._id !== event._id) {
            if (otherEvent.event === "HOVER") {
              hoveredDuration += otherEvent.duration;
              newEvent.isHovered = 1;
              newEvent.hoveredTimestamp = event.timestamp;
              newEvent.hoveredDate = event.date;
              newEvent.hoveredTime = event.time;
              newEvent.hoveredTOD = event.timeOfTheDay;
              newEvent.hoveredBrowser = event.browser;
              newEvent.hoveredDevice = event.device;
              newEvent.hoveredMobile = event.mobile;
              newEvent.hoveredOs = event.os;
              newEvent.hoveredIp = event.ip;
              newEvent.hoveredLocation = event.location;
            }
            if (otherEvent.event === "VIEW") {
              viewedDuration += otherEvent.duration;
              newEvent.isViewed = 1;
              newEvent.viewedTimestamp = event.timestamp;
              newEvent.viewedDate = event.date;
              newEvent.viewedTime = event.time;
              newEvent.viewedTOD = event.timeOfTheDay;
              newEvent.viewedBrowser = event.browser;
              newEvent.viewedDevice = event.device;
              newEvent.viewedMobile = event.mobile;
              newEvent.viewedOs = event.os;
              newEvent.viewedIp = event.ip;
              newEvent.viewedLocation = event.location;
            }
            if (otherEvent.event === "WISHLIST") {
              newEvent.isAddedToWishlist = 1;
              newEvent.addedToWishlistTimestamp = event.timestamp;
              newEvent.addedToWishlistDate = event.date;
              newEvent.addedToWishlistTime = event.time;
              newEvent.addedToWishlistTOD = event.timeOfTheDay;
              newEvent.addedToWishlistBrowser = event.browser;
              newEvent.addedToWishlistDevice = event.device;
              newEvent.addedToWishlistMobile = event.mobile;
              newEvent.addedToWishlistOs = event.os;
              newEvent.addedToWishlistIp = event.ip;
              newEvent.addedToWishlistLocation = event.location;
            }
            if (otherEvent.event === "CART") {
              newEvent.isAddedToCart = 1;
              newEvent.addedToCartTimestamp = event.timestamp;
              newEvent.addedToCartDate = event.date;
              newEvent.addedToCartTime = event.time;
              newEvent.addedToCartTOD = event.timeOfTheDay;
              newEvent.addedToCartBrowser = event.browser;
              newEvent.addedToCartDevice = event.device;
              newEvent.addedToCartMobile = event.mobile;
              newEvent.addedToCartOs = event.os;
              newEvent.addedToCartIp = event.ip;
              newEvent.addedToCartLocation = event.location;
            }
            if (otherEvent.event === "PURCHASE") {
              newEvent.isPurchased = 1;
              newEvent.purchasedTimestamp = event.timestamp;
              newEvent.purchasedDate = event.date;
              newEvent.purchasedTime = event.time;
              newEvent.purchasedTOD = event.timeOfTheDay;
              newEvent.purchasedBrowser = event.browser;
              newEvent.purchasedDevice = event.device;
              newEvent.purchasedMobile = event.mobile;
              newEvent.purchasedOs = event.os;
              newEvent.purchasedIp = event.ip;
              newEvent.purchasedLocation = event.location;
            }
            // }
          }

          newEvent.hoveredDuration = hoveredDuration;
          newEvent.viewedDuration = viewedDuration;

          const newPreprocessedEvent = new PreprocessedEvent(newEvent);
          const saved = await newPreprocessedEvent.save();
          if (saved) processedCount++;
        }
      }
    }

    res
      .status(200)
      .send(
        `Events Data Preprocessing Succeed. Saved ${processedCount} Records`
      );

    return;
  } catch (error) {
    console.error("Error (Preprocess Events) : \n", error);
    res.status(500).send(error);
  }
};

// newEvent = {
//   productId: event.productId,
//   userId: event.userId,
//   isDiscounted: event.isDiscounted ? 1 : 0,
//   isLoggedUser: event.isLoggedUser ? 1 : 0,
//   userAgeGroup: event.userAgeGroup,
//   season: event.season,
//   isHovered,
//   isViewed,
//   isAddedToWishlist,
//   isAddedToCart,
//   isPurchased,
//   hoveredDuration,
//   viewedDuration,
//   hoveredTimestamp,
//   viewedTimestamp,
//   addedToWishlistTimestamp,
//   addedToCartTimestamp,
//   purchasedTimestamp,
//   hoveredDate,
//   viewedDate,
//   addedToWishlistDate,
//   addedToCartDate,
//   purchasedDate,
//   hoveredTime,
//   viewedTime,
//   addedToWishlistTime,
//   addedToCartTime,
//   purchasedTime,
//   hoveredTOD,
//   viewedTOD,
//   addedToWishlistTOD,
//   addedToCartTOD,
//   purchasedTOD,
//   hoveredBrowser,
//   viewedBrowser,
//   addedToWishlistBrowser,
//   addedToCartBrowser,
//   purchasedBrowser,
//   hoveredDevice,
//   viewedDevice,
//   addedToWishlistDevice,
//   addedToCartDevice,
//   purchasedDevice,
//   hoveredMobile,
//   viewedMobile,
//   addedToWishlistMobile,
//   addedToCartMobile,
//   purchasedMobile,
//   hoveredOs,
//   viewedOs,
//   addedToWishlistOs,
//   addedToCartOs,
//   purchasedOs,
//   hoveredIp,
//   viewedIp,
//   addedToWishlistIp,
//   addedToCartIp,
//   purchasedIp,
//   hoveredLocation,
//   viewedLocation,
//   addedToWishlistLocation,
//   addedToCartLocation,
//   purchasedLocation,
// };
