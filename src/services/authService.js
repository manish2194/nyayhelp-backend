const User = require("../models/userModel");

const createUser = async ({ email, password, user_name }) => {
  return await User.create({ email, password , user_name });
};

const verifyUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("No user with this email found.");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid password.");
  }
  const { _id, user_name, email_verified, status, role } = user;
  // if(!email_verified) throw new Error("Please verify your email first");
  if(status === 'BLOCKED') throw new Error("User has been blocked");
  return {
    _id,
    user_name,
    email,
    status,
    role
  };
};

const isUserAlreadyRegistered = async (email) => {
    const userCount = await User.count({ email });
    return userCount > 0 ;
}

module.exports = {
  createUser,
  verifyUser,
  isUserAlreadyRegistered
};
