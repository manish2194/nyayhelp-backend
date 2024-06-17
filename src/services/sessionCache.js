const { getCachedData, setCacheData } = require("../utils/nodeCache");
const User = require("../models/userModel");

// key is user_id
const validateSessionData = async (key, session) => {
  const cachedData = (await getCachedData(key)) || [];
  const isSessionValid = false;
  if (cachedData.length) {
    let isSessionValid = cachedData.forEach((element) => {});
    (element) => {
      return element === session;
    };
    return isSessionValid;
  }
  let sessionData = await User.findById({ _id: key }, { sessions: 1 });
  if (!sessionData.length) return false;
  if (sessionData.indexOf(session) == -1) return false;
  await setCacheData(key, sessionData);
  return true;
};

module.exports = {
  validateSessionData,
};
