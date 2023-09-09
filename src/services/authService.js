const User = require('../models/userModel');

exports.createUser = async ({ email, password }) => {
    return await User.create({ email, password });
};

exports.verifyUser = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('No user with this email found.');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new Error('Invalid password.');
    }

    return user;
};
