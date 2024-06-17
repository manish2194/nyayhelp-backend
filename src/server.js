"use strict";

const config = require("./common/config");
const logger = require("./common/logger");
const mongoose = require("mongoose");

// Initialize DB Connections
require("./connections/mongo");

console.log("MOngo connection done");

const onServerInit = function (e) {
  logger.info(`NyayHelp server listening on port ${config.port}!`);
};

const onDestroy = async function (signal) {
  logger.info(`${signal} signal received`);
  logger.info("Graceful shutdown started. Closing Http server");

  server.close(async (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    try {
      logger.info("Http server closed.");
      await Promise.all([mongoose.disconnect()]);
      logger.info("DB connections closed.");
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  });
};

const app = require("./app");
const server = app.listen(config.port, onServerInit);

process.on("SIGTERM", onDestroy);
process.on("SIGINT", onDestroy);

// setTimeout(() => {
//   process.emit("SIGINT");
// }, 5000);

module.exports = app;
