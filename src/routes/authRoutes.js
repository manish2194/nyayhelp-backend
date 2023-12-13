const express = require('express');
const {signup, login, logout} = require('../controllers/authController');
const {checkAuthentication} = require('../middleware/requireAuth')
const router = express.Router();
router.post('/register', signup);
router.post('/login', login);
router.post('/logout', checkAuthentication(), logout);

module.exports = router;
