const jwt = require("jsonwebtoken");

module.exports = function (req, res, next, roles) {
  const user = req.user;

  if (!roles.includes(user.type))
    return res.status(403).send("Access Denied. You have no access");

  next();
};
