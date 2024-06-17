"use strict";

const mongoose = require("mongoose");
const config = require("../common/config.js");
const logger = require("../common/logger.js");

mongoose.set(
  "debug",
  ["development"].includes(config.env) // true for development
);

// async function connect(name, uri) {
//   logger.debug(uri);
//   console.time("mongodb connection time");
//   // let conn = mongoose.createConnection(uri, options);
//   await mongoose.connect(uri, options);
//   const conn = mongoose.connection.once;
//   conn.on("connected", function () {
//     console.timeLog("mongodb connection time");
//     logger.info(`MongoDB ${name} connected`);
//   });

//   conn.on("disconnected", function () {
//     logger.warn(`MongoDB ${name} disconnected`);
//   });

//   conn.on("reconnected", function () {
//     logger.info(`MongoDB ${name} reconnected`);
//   });

//   conn.on("error", function (err) {
//     logger.error(`Error connection MongoDB ${name}`);
//     console.error(err);
//     // If first connect fails because mongod is down, try again later.
//     // This is only needed for first connect, not for runtime reconnects.
//     // See: https://github.com/Automattic/mongoose/issues/5169
//     // Wait for a bit, then try to connect again

//     // [PNC]: removed the if clause to retry on every connection error
//     setTimeout(function () {
//       logger.info(`Retrying first connect for MongoDB ${name}...`);
//       conn.openUri(uri).catch(() => {});
//       // Why the empty catch?
//       // Well, errors thrown by db.open() will also be passed to .on('error'),
//       // so we can handle them there, no need to log anything in the catch here.
//       // But we still need this empty catch to avoid unhandled rejections.
//     }, 5 * 1000);
//   });

//   conn.on("reconnectFailed", function () {
//     logger.info(`MongoDB ${name} reconnectFailed`);
//   });

//   return conn;
// }

// const nyayhelp = connect(
//   "NyayHelp Read Write",
//   config.mongo.nyayhelp_read_write.uri
// );

const { promisify } = require("util");
const setTimeoutPromise = promisify(setTimeout);

const connectWithRetry = async (uri, options, maxRetry = 50, delay = 5000) => {
  let retryCount = 0;

  const connect = async () => {
    try {
      console.log(
        `Attempting to connect to MongoDB (Retry ${retryCount + 1})...`
      );
      await mongoose.connect(uri, options);
      console.log("MongoDB connection successful!");
      retryCount = 0; // Reset retry count on successful connection
    } catch (error) {
      console.error(
        `MongoDB connection error (Retry ${retryCount + 1}):`,
        error.message
      );
      retryCount++;
      if (retryCount <= maxRetry) {
        await setTimeoutPromise(delay);
        await connect(); // Retry connection
      } else {
        console.error(
          "Max retry attempts reached. Failed to connect to MongoDB."
        );
      }
    }
  };

  // Event listener for MongoDB disconnection
  mongoose.connection.on("disconnected", async () => {
    console.error("MongoDB disconnected. Attempting to reconnect...");
    await connect(); // Retry connection on disconnection
  });

  mongoose.connection.on("connected", async () => {
    console.error("MongoDB connected..");
  });

  mongoose.connection.on("reconnected", () => {
    logger.info(`MongoDB  reconnected`);
  });

  // Connect initially
  await connect();
};

// Usage:
const uri = config.mongo.nyayhelp_read_write.uri;
const options = {
  appName: config?.infrastructure?.pod_name || "NyayHelp Local",
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

connectWithRetry(uri, options);

module.exports = {
  nyayhelp: connectWithRetry,
};
