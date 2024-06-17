const express = require("express");
const {
  signup,
  sendOtpHandler,
  logout,
  login,
} = require("../controllers/authController");
const { checkAuthentication } = require("../middleware/requireAuth");
const router = express.Router();

// router.post("/register", signup);
router.post("/otp", sendOtpHandler);
router.post("/login", login);
router.post("/logout", checkAuthentication(), logout);

module.exports = router;
