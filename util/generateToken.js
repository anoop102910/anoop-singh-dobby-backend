const jwt = require("jsonwebtoken");

exports.generateToken = (payload,time) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: time,
  });
};


