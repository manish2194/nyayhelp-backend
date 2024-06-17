const express = require("express");
const { getUser } = require("../controllers/userController");
const { checkAuthentication } = require("../middleware/requireAuth");
const router = express.Router();

router.get("/", checkAuthentication(), getUser);

module.exports = router;
