const express = require("express");
const authRoutes = require("./authRoutes");
const blogRoutes = require("./blogRoutes");
const questionRoutes = require("./questionRoutes");
const userRoutes = require("./userRoutes");
const router = express.Router();
router.use("/v1/auth", authRoutes);
router.use("/v1/blog", blogRoutes);
router.use("/v1/question", questionRoutes);
router.use("/v1/user", userRoutes);

module.exports = router;
