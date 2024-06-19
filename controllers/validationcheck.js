const joi = require("../utils/joivalidate");

const check = (req, res, next) => {
  if (joi.validate(req.body).error) {
    return next(joi.validate(req.body).error);
  }
  next();
};
module.exports = check;
