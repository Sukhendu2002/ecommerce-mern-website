const Users = require("../models/userModel");
const authAdmin = (req, res, next) => {
  try {
    const user = await Users.findById(req.user._id);
    if (user.role === 0) {
      return res.status(401).json({
        message: "You are not authorized to access this route",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

module.exports = authAdmin;
