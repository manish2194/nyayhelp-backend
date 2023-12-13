// const passport = require('passport');
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require("jsonwebtoken");
const config = require("../common/config");

// const opts = {};

const tokenExtractor = function (req, key = config.get("user_cookie")) {
  const token = req.cookies[key];

  if (token) return token;
  const authHeader = req.headers["authorization"];

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7); // Remove 'Bearer ' prefix
    return bearerToken;
  }
  return null;
};

// const secretOrKeyProvider = (req, rawJwtToken, done) => {
//     try {
//       jwt.verify(rawJwtToken, config.get('jwt_secret'));
//       done(null, config.get('jwt_secret'));
//       return;
//     } catch (error) {
//       console.log("error", error);
//     }
//   done(new Error('Invalid signature'), null);
// };

// opts.jwtFromRequest = tokenExtractor;
// opts.secretOrKeyProvider = secretOrKeyProvider;
// opts.passReqToCallback = true;
// // opts.issuer = `auth.${config.domain}`;
// // opts.audience = `${config.domain}`;

// const verify = function (req, jwt_payload, done) {

//   if (!isValidObjectId(jwt_payload.user_id)) {
//     return done(null, false);
//   }
//   User.findById(jwt_payload.user_id, function (err, user) {
//     if (err) {
//       logger.error('Error on findById user', err);
//     }
//     if (user) {
//       // validate token
//       const access_token = tokenExtractor(req);
//       const token = user.sessions.find((s) => {
//         if (s.access_token === access_token) {
//           return true;
//         }
//       });
//       if (token?.active) {
//         return done(null, user);
//       }
//       return done(null, false);
//     } else {
//       return done(null, false);
//       // or you could create a new account
//     }
//   });
// };
// passport.use(new JwtStrategy(opts, verify));

// const checkAuthentication = () => {
//   return (req, res, next) => {
//     const token = tokenExtractor(req);
//     if (token) {
//       secretOrKeyProvider(req, token, (err, data) => {
//         if (err) {
//           next();
//         } else {
//           const payload = jwt.verify(token, data);

//           verify(req, payload, (error, user) => {
//             if (!error && user) {
//               req.user = user;
//             }
//             next();
//           });
//         }
//       });
//     } else {
//       next();
//     }
//   };
// };

// const authenticate = function () {
//   return passport.authenticate('jwt', { session: false });
// };

const User = require("../models/userModel");

const checkAuthentication = () => {
  return (req, res, next) => {
    const token = tokenExtractor(req);
    console.log("token", token);

    if (!token) {
      return res.status(401).send("Not authorized.");
    }

    jwt.verify(token, config.get("jwt_secret"), async (err, payload) => {
      if (err) {
        return res.status(401).send("Not authorized.");
      }
      console.log("payload", payload);

      // const user = await User.findById(payload.userId);

      req.user = payload.user;

      next();
    });
  };
};

module.exports = {
  checkAuthentication,
};
