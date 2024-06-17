const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const app = express();
const { errors: celebrateErrors } = require("celebrate");
const errorHandler = require("./middleware/errorHandler");
const { NotFound } = require("./error/index");

//Use CORS middleware with the configuration
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your specific frontend domain(s)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow session cookie to be sent with requests
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Serve static files from the 'dist' directory
// app.use(express.static(path.join(__dirname, "dist")));
// app.use(express.static(path.join(__dirname, "client/dist")));

app.use(["/_healthz", "/_readyz"], (req, res) => {
  res.send({ ok: "ok" });
});

app.use("/api", routes);

app.all("*", function (req, res, next) {
  throw new NotFound("not found");
});

app.use(celebrateErrors());
app.use(errorHandler);

process.on("unhandledRejection", function (err, data) {
  console.log("Error not handled at all:::", err);
});

module.exports = app;
