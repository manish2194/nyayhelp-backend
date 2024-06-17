const mongoose = require("mongoose");

function generateOTP(doc, length = 6) {
  var digits = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * 10)];
  }
  return code;
}

const OTPSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success"],
      default: "pending",
    },
    attempts: {
      send: { type: Number, default: 0 },
      verify: { type: Number, default: 0 },
    },
    code: {
      type: String,
      required: true,
      default: generateOTP,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

OTPSchema.index({ phone: 1 });
OTPSchema.index({ created_at: 1 }, { expireAfterSeconds: 60 * 10 }); // 10 minutes

module.exports = mongoose.model("OTP", OTPSchema);
