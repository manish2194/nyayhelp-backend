const express = require("express");
const path = require("path");
const cors = require("cors");

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const routes = require("./src/routes");
const requireAuth = require("./src/middleware/requireAuth");
const app = express();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const port = process.env.PORT || 9000;

// CORS configuration
const corsOptions = {
  origin: "*", // Replace with your specific frontend domain(s)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow session cookie to be sent with requests
  optionsSuccessStatus: 204,
};

// Use CORS middleware with the configuration
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/nyay-help", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "client/dist")));

app.use(["/_healthz", "/_readyz"], (req, res) => {
  res.send({ ok: "ok" });
});

// ======google auth ======================
// app.use(require('express-session')({ secret: 'mySecret', resave: true, saveUninitialized: true }));

// // Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// // Serialize and deserialize user
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// passport.use(new GoogleStrategy({
//     clientID: '774103282669-abbt4lvd3cjc9kur9auo2rvijc52edkb.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL: "http://localhost:9000/auth/google/callback"
//   },
//   (accessToken, refreshToken, profile, done) => {
//     return done(null, profile);
//   }
// ));

//==========END ==================

app.use(routes);

// Endpoints
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:8000");
  }
);

// Handle all routes and return 'index.html' for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
