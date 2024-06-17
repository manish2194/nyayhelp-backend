const User = require("../models/userModel");
const { getPhoneNumber } = require("../utils");

async function createUserIfNotExists({ phone }) {
  try {
    const user = new User({
      country: "IN",
      phone,
    });
    await user.save();
    return user;
  } catch (error) {
    if (error.code === 11000) {
      return null;
    } else {
      throw error;
    }
  }
}

async function generateTokensByPhone({ phone }) {
  const user = await User.findOne({ phone }, null, {
    readPreference: "primary",
  });

  return user.generateTokens();
}

module.exports = {
  createUserIfNotExists,
  generateTokensByPhone,
};
