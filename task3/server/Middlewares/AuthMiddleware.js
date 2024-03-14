const User = require("../Models/UserModel")
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      const user = await User.findById(data.id)
      if (user) return res.json({ status: true, user: user.username })
      else return res.json({ status: false })
    }
  })
}

// Define middleware to check user's role
module.exports.checkAdminRole = (req, res, next) => {
  // Check if user is authenticated and has admin role
  if (req.user && req.user.role === 'admin') {
    next(); // User is authorized, proceed to next middleware or route handler
  } else {
    res.status(403).json({ message: 'Unauthorized' }); // User is not authorized
  }
};



