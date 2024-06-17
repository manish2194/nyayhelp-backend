const _ = require("lodash");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../common/config");
const mongoose = require("mongoose");
// const MongoPaging = require("mongo-cursor-pagination");

const { AUTH_VALIDITY } = require("../common/constant.js");
const { hexToBase64, regex } = require("../utils");

const SessionSchema = new mongoose.Schema(
  {
    access_token: String,
    refresh_token: String,
    active: { type: Boolean, default: true },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      default: "",
      validate: {
        validator: (val) => {
          return val.length === 0 || val.length >= 3;
        },
        message: (props) => `Fullname must be atleast 3 characters`,
      },
    },
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 24,
      default: function (obj) {
        return hexToBase64(obj.id)
          .replace(/[\+\/]/g, "")
          .toLowerCase();
      },
      validate: regex.username,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "moderator", "support"],
      default: "user",
    },
    about: {
      type: String,
      default: "",
      maxlength: 100,
    },
    dob: { type: Date },
    country: {
      type: String,
      required: true,
      default: "IN",
      maxlength: 3,
    },
    state: {
      type: String,
      default: "",
      maxlength: 3,
    },
    is_instagram_connected: {
      type: Boolean,
      required: false,
    },
    instagram_pictures: {
      type: [
        {
          type: String,
        },
      ],
      required: false,
    },
    instagram_username: { type: String, required: false },
    phone: {
      type: String,
      required: true,
    },
    email_id: {
      type: String,
      default: "",
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    verified: { type: Boolean, default: false },
    sessions: { type: [SessionSchema] },
    settings: {
      account: {
        language: {
          type: String,
          required: false,
          default: "en",
        },
      },
      privacy: {
        private_account: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
      push_notification: {
        active: {
          type: Boolean,
          required: true,
          default: true,
        },
      },
    },
    interests: {
      type: [{ type: String }],
      default: () => {
        return [];
      },
      validate: [
        (val) => {
          return val.length <= 10;
        },
        `{PATH} exceeds the limit of 10`,
      ],
    },
    referral_code: { type: String, default: null },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

UserSchema.methods.getProfile = function () {
  const {
    _id,
    full_name,
    email_id,
    username,
    about,
    dob,
    country,
    state,
    phone,
    settings,
    location,
    pictures,
    interests,
    is_instagram_connected,
    instagram_pictures,
    instagram_username,
    role,
  } = this;

  // check completion status
  let profile_incomplete =
    hexToBase64(String(_id))
      .replace(/[\+\/]/g, "")
      .toLowerCase() === username
      ? true
      : undefined;

  return {
    _id,
    full_name,
    email_id: email_id ? email_id : "",
    username,
    about,
    dob: dob ? dob : undefined,
    country,
    state,
    phone,
    profile_incomplete,
    is_block: this.blocked,
    is_private_account: settings.privacy.private_account,
    location,
    pictures,
    interests,
    is_instagram_connected,
    instagram_pictures,
    instagram_username,
    role,
  };
};

UserSchema.methods.getSettings = function () {
  const { settings } = this;
  return { settings, languages };
};

UserSchema.methods.isPrivateAccount = function () {
  return this.settings.privacy.private_account;
};

UserSchema.methods.generateTokens = async function (platformMode = "default") {
  if (this.blocked) {
    this.sessions = [];
    await this.save();
    return {
      user_id: this.id,
      is_block: this.blocked,
    };
  }

  const jwt_payload = {
    user_id: this.id,
    is_block: this.blocked,
    role: this.role,
    exp: Date.now() / 1000 + AUTH_VALIDITY,
  };
  const access_token = jwt.sign(jwt_payload, config.jwt_secret); // latest secret will use for new tokens
  const refresh_token = crypto.randomBytes(32).toString("base64");

  const is_prev_sessions = this.sessions.length;

  this.sessions.push({ access_token, refresh_token });
  await this.save();
  // await Promise.all([
  //   _authSessionCache.add(this.id, access_token, AUTH_VALIDITY),

  // ]);

  return {
    user_id: this.id,
    access_token,
    refresh_token,
    is_block: this.blocked,
    expiry: jwt_payload.exp,
    is_prev_sessions,
    role: this.role,
  };
};

UserSchema.statics.getUserForAdmin = function (user) {
  user.stats = { session_count: user.sessions.length };
  delete user.sessions;
  return user;
};

UserSchema.index({ phone: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ full_name: "text", username: "text" });
UserSchema.index({ updated_at: -1 });
UserSchema.index({ "sessions.refresh_token": 1 });
UserSchema.index({ referral_code: 1 });

// UserSchema.plugin(MongoPaging.mongoosePlugin);

module.exports = mongoose.model("User", UserSchema);
