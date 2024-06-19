const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;
const verifyToken = (req, res, next) => {
  const token = req.session.token;
  if (!token) {
    req.session.redirectTo = req.originalUrl;
    return res.redirect("/login");
  }

  jwt.verify(token, secret_key, (err, decoded) => {
    if (err) {
      return res.redirect("/login");
    }
    req.user = decoded;
    next();
  });
};
module.exports = verifyToken;
