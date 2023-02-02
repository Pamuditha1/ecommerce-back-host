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
        isDiscounted: event.isDiscounted ? true : false,
        isLoggedUser: event.isLoggedUser ? true : false,
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
              newEvent.isHovered = true;
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
              newEvent.isViewed = true;
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
              newEvent.isAddedToWishlist = true;
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
              newEvent.isAddedToCart = true;
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
              newEvent.isPurchased = true;
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

// exports.updateEvents = async (req, res) => {
//   await PreprocessedEvent.updateMany({ isHovered: 0 }, { isHovered: 111111 });
//   await PreprocessedEvent.updateMany({ isHovered: 1 }, { isHovered: 222222 });

//   await PreprocessedEvent.updateMany({ isViewed: 0 }, { isViewed: 111111 });
//   await PreprocessedEvent.updateMany({ isViewed: 1 }, { isViewed: 222222 });

//   await PreprocessedEvent.updateMany(
//     { isAddedToWishlist: 0 },
//     { isAddedToWishlist: 111111 }
//   );
//   await PreprocessedEvent.updateMany(
//     { isAddedToWishlist: 1 },
//     { isAddedToWishlist: 222222 }
//   );

//   await PreprocessedEvent.updateMany(
//     {
//       isAddedToCart: 0,
//     },
//     {
//       isAddedToCart: 111111,
//     }
//   );
//   await PreprocessedEvent.updateMany(
//     {
//       isAddedToCart: 1,
//     },
//     {
//       isAddedToCart: 222222,
//     }
//   );

//   await PreprocessedEvent.updateMany(
//     {
//       isPurchased: 0,
//     },
//     {
//       isPurchased: 111111,
//     }
//   );
//   await PreprocessedEvent.updateMany(
//     {
//       isPurchased: 1,
//     },
//     {
//       isPurchased: 222222,
//     }
//   );

//   await PreprocessedEvent.updateMany(
//     {
//       isDiscounted: 0,
//     },
//     {
//       isDiscounted: 111111,
//     }
//   );
//   await PreprocessedEvent.updateMany(
//     {
//       isDiscounted: 1,
//     },
//     {
//       isDiscounted: 222222,
//     }
//   );

//   await PreprocessedEvent.updateMany(
//     {
//       isLoggedUser: 0,
//     },
//     {
//       isLoggedUser: 111111,
//     }
//   );
//   await PreprocessedEvent.updateMany(
//     {
//       isLoggedUser: 1,
//     },
//     {
//       isLoggedUser: 222222,
//     }
//   );

//   res.status(200).json({ msg: "Success" });
// };

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
