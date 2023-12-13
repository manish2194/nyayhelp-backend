const convict = require('convict');

// Define a schema
const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8080,
    env: 'PORT',
    arg: 'port'
  },
  enable_cors: {
    doc: 'cors toggle',
    format: Boolean,
    default: true,
    env: 'ENABLE_CORS',
    arg: 'enable_cors',
  },
  jwt_secret: {
    doc: 'JWT Secrets',
    format: String,
    default: 'nyayhelp@2024!!',
    env: 'JWT_SECRET',
    arg: 'jwt_secret',
  },
  user_cookie: {
    doc: 'user cookie',
    format: String,
    default: 'user.session',
    env: 'USER_COOKIE',
    arg: 'user_cookie',
  },
});



// Perform validation
config.validate({allowed: 'strict'});

module.exports = config;