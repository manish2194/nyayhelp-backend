const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = (req, res, next) => {
  const token = req.cookies.user_session;

  if (!token) {
    return res.status(401).send('Not authorized.');
  }

  jwt.verify(token, 'YOUR_SECRET_KEY', async (err, payload) => {
    if (err) {
      return res.status(401).send('Not authorized.');
    }

    const user = await User.findById(payload.userId);

    req.user = user;

    next();
  });
};
