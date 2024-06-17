const _ = require("lodash");
const crypto = require("crypto");
const { parsePhoneNumber } = require("awesome-phonenumber");

const mathRandom = function () {
  return crypto.randomBytes(4).readUInt32LE() / 0x100000000;
};
exports.getPhoneNumber = function (phone) {
  return parsePhoneNumber(phone);
};

exports.hexToBase64 = (hexString) => {
  return Buffer.from(hexString, "hex").toString("base64");
};

exports.regex = {
  // username: /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
  // https://stackoverflow.com/a/39084354/6112685
  username:
    /^(?:[a-z_](?:(?:[a-z0-9]|(?:\.(?!\.))|(?:_(?!_))){0,18}(?:[a-z0-9_]))?)$/,
  usernameFilterCharacters: /[^a-zA-Z0-9_.]+/g,
  slug: /^[\w.-]+$/,
};

exports.generateRandomInteger = function (length) {
  const add = 1;
  let max = 12 - add;

  if (length > max) {
    return generateRandomInteger(max) + generateRandomInteger(length - max);
  }

  max = Math.pow(10, length + add);
  const min = max / 10; // Math.pow(10, length) basically
  const number = Math.floor(mathRandom() * (max - min + add)) + min;

  return ("" + number).substring(add);
};

exports.generateRandomString = function (
  length,
  type = { small: true, capital: true, number: true }
) {
  let result = "";
  let characters = "";
  if (type.small) {
    characters += "abcdefghijklmnopqrstuvwxyz";
  }
  if (type.capital) {
    characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  if (type.number) {
    characters += "0123456789";
  }
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(mathRandom() * charactersLength));
  }
  return result;
};

exports.getHashtags = function (content = "") {
  if (!content) return [];
  let tags = content.match(/#[\p{L}]+/giu);
  tags = _.uniq(tags);
  tags = tags.map((tag) => tag.substring(1));
  return tags;
};

exports.hexToBase64 = (hexString) => {
  return Buffer.from(hexString, "hex").toString("base64");
};

exports.base64ToHex = (base64String) => {
  return Buffer.from(base64String, "base64").toString("hex");
};

exports.formatRupee = (number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(number);
};

exports.numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Function to generate random number
exports.randomNumber = (min, max) => {
  //min,max both inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.validateEmail = (email_id) => {
  const regex_email = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  return regex_email.test(email_id);
};

exports.identifyAppVersionNumber = (platformVersion) => {
  try {
    const [versionString, featureId] = platformVersion.split("_");
    const versionSpitted = versionString.split(".");
    const isAllNumbers = versionSpitted.every((n) => !isNaN(n));
    if (!isAllNumbers && !featureId) {
      throw new Error("Not all version fields are number");
    }
    let versionNumber = versionSpitted.reduce(
      (cur, acc) => cur * 10000 + parseInt(acc),
      0
    );

    return versionNumber;
  } catch (error) {
    // logger.error('identifyAppVersionNumber', error);
    return 0;
  }
};

exports.getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

exports.pageSizeCalculation = (page, page_size) => {
  page = page < 1 ? 1 : +page;
  page_size = page_size < 1 || page_size > 50 ? 10 : +page_size;
  let skipCount = page_size * (page - 1) || 0;
  return {
    page_size,
    page,
    skipCount,
  };
};
