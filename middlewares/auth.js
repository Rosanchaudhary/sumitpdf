const jwt = require("jsonwebtoken");

// Middleware to verify JWT token from cookie
const auth = (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/login");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.redirect("/login");
    }
    
    return res.redirect("/login");
  }
};

module.exports = auth;