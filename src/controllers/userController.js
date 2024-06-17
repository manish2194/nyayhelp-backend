const User = require("../models/userModel");

const getUser = async (req, res, next) => {
  // console.log("user====", req.user);
  let user = await User.findById(req.user.user_id);
  // console.log("user", user);
  const { username, full_name, phone, email_id, about, verified } = user;
  res.json({ user: { username, full_name, phone, email_id, about, verified } });
};

module.exports = {
  getUser,
};
