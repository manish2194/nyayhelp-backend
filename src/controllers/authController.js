const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { getPhoneNumber } = require("../utils");
const { BadRequest } = require("../error");
const {
  createUser,
  verifyUser,
  isUserAlreadyRegistered,
} = require("../services/authService");

const {
  createUserIfNotExists,
  generateTokensByPhone,
} = require("../services/userService.js");
// const USER_COOKIE = 'user_session';
// const JWT_SECRET_KEY = 'nyayhelp@2024!!'

const { sendOtp, verify } = require("../services/otpService");
const config = require("../common/config");
const { AUTH_COOKIE } = require("../common/constant.js");

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

const sendOtpHandler = async (req, res, next) => {
  try {
    const { country_code, phone } = req.body;
    const p = getPhoneNumber(`${country_code}${phone}`);
    if (!p.valid) {
      throw new BadRequest(`Please enter a valid 10-digit mobile number`);
    }
    await sendOtp(phone);
    res.json({ data: null, message: "Otp has been sent" });
  } catch (err) {
    console.log("error while sending otp", err);
    res.status(400).send({ success: false, message: err.message, data: null });
  }
};

const validateOtp = async (req, res) => {
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

async function login(req, res, next) {
  try {
    const { country_code, phone, code } = req.body;
    const p = getPhoneNumber(`${country_code}${phone}`);
    if (!p.valid) {
      throw new BadRequest(`Please enter a valid 10-digit mobile number`);
    }
    // let response = await verify(phone, code);
    if (true || response?.valid) {
      // check user
      const new_user = await createUserIfNotExists({
        phone,
      });

      const {
        user_id,
        access_token,
        refresh_token,
        is_block,
        is_prev_sessions,
        expiry,
        role,
      } = await generateTokensByPhone({
        phone,
      });

      if (is_block) {
        res.status(401).json({ message: "Account is blocked", is_block });
        return;
      }

      const cookieOptions = {
        expires: new Date(Date.now() + 360000000),
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
        path: "/",
        domain: "localhost",
      };

      res.cookie(AUTH_COOKIE, access_token, cookieOptions);

      res.json({
        new_user: !!new_user,
        access_token,
        refresh_token,
        is_block,
        is_prev_sessions,
      });

      return;
    }
    res
      .status(401)
      .json({ message: "The OTP that you have entered is incorrect" });
  } catch (error) {
    switch (error.code) {
      case 20404:
        return res
          .status(401)
          .json({ message: "The OTP that you have entered is incorrect" });
      case 60202:
        return res.status(422).json({
          message:
            "Maximum OTP verification attempts reached. Please try again after 10 minutes!",
        });
      default:
        next(error);
    }
  }
}

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
  sendOtpHandler,
  logout,
  login,
  validateOtp,
};
