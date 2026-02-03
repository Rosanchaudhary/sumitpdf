// Middleware to check if user is admin
// Note: This middleware should be used AFTER the auth middleware
const adminOnly = (req, res, next) => {
  try {
    // Check if user exists (should be set by auth middleware)
    if (!req.user) {
      return res.redirect("/login");
    }

    // Check if user role is admin
    if (req.user.role !== "admin") {
      return res.redirect("/login");
    }

    next();
  } catch (error) {
    return res.redirect("/login");
  }
};

module.exports = adminOnly;