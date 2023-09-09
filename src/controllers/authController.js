const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const authService = require("../services/authService");

exports.signup = async (req, res) => {
  try {
    const user = await authService.createUser(req.body);

    const token = jwt.sign({ userId: user._id }, "YOUR_SECRET_KEY");

    res.cookie("user_session", token, {
      expires: new Date(Date.now() + 3600000), // 1 hour
      httpOnly: true,
    });

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await authService.verifyUser(req.body);

    if (!user) {
      return res.status(404).send("No user with this email found.");
    }
    const token = jwt.sign({ userId: user._id }, "YOUR_SECRET_KEY");

    res.cookie("user_session", token, {
      expires: new Date(Date.now() + 36000000),
      httpOnly: true,
    });

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).send(err.message);
  }
};
