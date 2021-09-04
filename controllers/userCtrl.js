const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await Users.findOne({ email });
      if (user) {
        return res.status(400).json({
          msg: "User already exists",
        });
      }
      if (password.length < 6) {
        return res.status(400).json({
          msg: "Password must be at least 6 characters long",
        });
      }
      //password encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });
      //save user to database
      await newUser.save();

      //create token
      const accessToken = createAccessToken({
        id: newUser._id,
      });
      const refreshToken = createRefreshToken({
        id: newUser._id,
      });
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });
      res.json({ accessToken });

      res.status(200).json({
        msg: "User created successfully",
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(400).json({
          msg: "User does not exist",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          msg: "Incorrect password",
        });
      }

      //create token
      const accessToken = createAccessToken({
        id: user._id,
      });
      const refreshToken = createRefreshToken({
        id: user._id,
      });
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });
      res.json({ accessToken });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  },

  logout: (req, res) => {
    try {
      res.clearCookie("refreshtoken", {
        path: "/user/refresh_token",
      });
      return res.json({ msg: "Logged out successfully" });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  },

  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) {
        return res.status(400).json({
          msg: "Plase Login or Register",
        });
      }
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(401).json({
            msg: "Invalid Token",
          });
        }
        const accessToken = createAccessToken({
          id: user.id,
        });
        res.json({ accessToken });
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(400).json({
          msg: "User not found",
        });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userCtrl;
