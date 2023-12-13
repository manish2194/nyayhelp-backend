const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//status ->  PENDING, ACTIVE, BLOCKED

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "PENDING" 
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER'],  
    default: 'USER'
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
