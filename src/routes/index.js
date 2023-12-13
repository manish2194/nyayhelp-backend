const express = require("express");
const authRoutes = require("./authRoutes");
const blogRoutes = require("./blogRoutes");
const questionRoutes = require("./questionRoutes");
const router = express.Router();
router.use([authRoutes, blogRoutes, questionRoutes]);
module.exports = router;
