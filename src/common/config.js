const convict = require("convict");
const _ = require("lodash");

// Define a schema
const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  domain: {
    doc: "The application environment.",
    format: String,
    default: "",
    env: "DOMAIN",
  },
  port: {
    doc: "The port to bind.",
    format: Number,
    default: 9000,
    env: "PORT",
    arg: "port",
  },
  enable_cors: {
    doc: "cors toggle",
    format: Boolean,
    default: true,
    env: "ENABLE_CORS",
    arg: "enable_cors",
  },
  jwt_secret: {
    doc: "JWT Secrets",
    format: String,
    default: "nyayhelp@2024!!",
    env: "JWT_SECRET",
    arg: "jwt_secret",
  },
  user_cookie: {
    doc: "user cookie",
    format: String,
    default: "__nyayhelp.session",
    env: "USER_COOKIE",
    arg: "user_cookie",
  },
  log_level: {
    doc: "log level for logger",
    format: String,
    default: "info",
    env: "LOG_LEVEL",
    arg: "log_level",
  },
  mongo: {
    nyayhelp_read_write: {
      uri: {
        doc: "nyayhelp mongo",
        format: String,
        default: "mongodb://localhost:27017/nyay-help",
        env: "MONGO_NYAYHELP_READ_WRITE",
        arg: "mongo_nyayhelp_read_write",
      },
    },
  },
});

// Perform validation
config.validate({ allowed: "strict" });

_.extend(config, config.get());

module.exports = config;
