const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const {
  createUser,
  verifyUser,
  isUserAlreadyRegistered,
} = require("../services/authService");
// const USER_COOKIE = 'user_session';
// const JWT_SECRET_KEY = 'nyayhelp@2024!!'
const config = require("../common/config");

const cookie = require("cookie");

const signup = async (req, res) => {
  try {
    const { email, password, user_name } = req.body || {};
    if (!email || !password || !user_name) throw new Error("Invalid request");
    let userExist = await isUserAlreadyRegistered(email);
    if (userExist) throw new Error("User already registered");
    const user = await createUser({ email, password, user_name });
    const { _id } = user;
    // 1. Generate Code

    // 2. Send Email for verification

    // const token = jwt.sign({ userId: user._id }, "YOUR_SECRET_KEY");

    // res.cookie("user_session", token, {
    //   expires: new Date(Date.now() + 3600000), // 1 hour
    //   httpOnly: true,
    // });

    res.json({ data: null, message: "Please verify email" });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) throw new Error("Invalid request");
    const user = await verifyUser({ email, password });

    if (!user) {
      return res.status(404).send("No user with this email found.");
    }
    const token = jwt.sign({ user }, config.get("jwt_secret"));

    const cookieOptions = {
      expires: new Date(Date.now() + 360000000),
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      domain: "http://localhost:8000",
    };
    res.cookie("text", token, cookieOptions);
    // res.setHeader(
    //   "Set-Cookie",
    //   cookie.serialize(config.get("user_cookie"), token, cookieOptions)
    // );
    res.json({ user, token });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie(config.get("user_cookie"));
    res.json({ message: "Logout Successfully" });
  } catch (err) {
    res.status(400).send(err.message);
  }
};
module.exports = {
  signup,
  login,
  logout,
};
