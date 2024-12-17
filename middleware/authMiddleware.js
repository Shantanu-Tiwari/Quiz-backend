const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Check for token in the Authorization header
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // Extract the token (after "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach decoded token payload to the request
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};
