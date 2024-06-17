"use strict";

const { createLogger, format, transports } = require("winston");
// transports.Sentry = require('winston-sentry-log');
transports.Sentry = require("winston-transport-sentry-node").default;
const config = require("./config");

const { splat, combine, timestamp, errors, json, simple, colorize } = format;

const logger = createLogger({
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    splat(),
    json()
  ),
  defaultMeta: { service: config.service },
});

if (["development"].includes(config.env)) {
  logger.add(new transports.Console({ format: combine(colorize(), simple()) }));
} else {
  logger.add(
    new transports.Console({
      level: config.log_level || "info",
      handleExceptions: true,
    })
  );
  logger.add(new transports.Sentry({ level: "error" }));
}

module.exports = logger;
