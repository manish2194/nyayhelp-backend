const { getPhoneNumber } = require("../utils");
const OTP = require("../models/otpModel");
const axios = require("axios");
async function sendSms(to, otp) {
  if (!getPhoneNumber("+91" + to).valid) {
    const error = new Error("Please enter a valid 10-digit mobile number");
    error.statusCode = 400;
    throw error;
  }
  return sendSMSbyFast2SMS(to, otp);
}

async function sendSMSbyFast2SMS(phoneNumber, otp) {
  try {
    const data = {
      variables_values: otp,
      route: "otp",
      numbers: phoneNumber,
    };
    // let response = await axios.get(
    //   `https://www.fast2sms.com/dev/bulkV2?authorization=vwdT1sW6J2YUfAhB5iuGcoyRbX8SVzgInPkrLCKxqtlM0HQFjNLs52BeNT4b9x1chgSR8vtUXAzQyrMk&route=otp&variables_values=${otp}&flash=0&numbers=${phoneNumber}`
    // );

    // await axios.post("https://www.fast2sms.com/dev/bulkV2", data, {
    //   headers: {
    //     authorization:
    //       "vwdT1sW6J2YUfAhB5iuGcoyRbX8SVzgInPkrLCKxqtlM0HQFjNLs52BeNT4b9x1chgSR8vtUXAzQyrMk",
    //     "Content-Type": "application/json",
    //   },
    // });
    return true;
  } catch (err) {
    console.log("Error sending OTP", err);
  }
}

async function sendOtp(phone) {
  let otp = await OTP.findOne({ phone, status: "pending" }).sort({
    updated_at: -1,
  });
  if (!otp) {
    const res = await OTP.insertMany([{ phone }]);
    otp = res[0];
  } else if (otp.attempts.send >= 5) {
    const error = new Error(
      "Maximum OTP verification attempts reached. Please try again after 10 minutes!"
    );
    error.code = 60202;
    error.name = "MaxCheckAttemptsReached";
    error.statusCode = 422;
    throw error;
  }
  console.log("OTP", otp.code);
  // return;
  const success = await sendSms(phone, otp.code);
  if (success) {
    otp = await OTP.findOneAndUpdate(
      { phone, status: "pending" },
      { $inc: { "attempts.send": 1 } },
      { new: true }
    ).sort({ updated_at: -1 });
    return {
      status: otp.status,
      attempts: otp.attempts.send,
      last_attempt: otp.updated_at,
    };
  }
  // unable to send OTP
  const error = new Error(
    "Unable to send OTP, please try again after sometime"
  );
  error.name = "UnableToSendOTP";
  error.statusCode = 422;
  throw error;
}

async function verify(phone, code) {
  let otp = await OTP.findOne({ phone, code, status: "pending" }).sort({
    updated_at: -1,
  });
  if (!otp) {
    otp = await OTP.findOneAndUpdate(
      { phone, status: "pending" },
      { $inc: { "attempts.verify": 1 } },
      { new: true }
    ).sort({ updated_at: -1 });
    if (otp?.attempts.verify >= 5) {
      const error = new Error(
        "Multiple invalid attempts. Try after 10 minutes"
      );
      error.name = "MaxAttemptsReached";
      error.statusCode = 429;
      throw error;
    }
    const error = new Error("The OTP that you have entered is incorrect");
    error.name = "InvalidCode";
    error.code = 20404;
    error.statusCode = 401;
    throw error;
  }
  await OTP.findOneAndUpdate(
    { phone, status: "pending" },
    { $set: { status: "success" } }
  ).sort({ updated_at: -1 });
  return { valid: true };
}

module.exports = { sendOtp, verify };
