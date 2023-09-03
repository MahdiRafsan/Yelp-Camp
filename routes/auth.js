const express = require('express');
const router = express.Router();
const passport = require('passport');

const wrapAsync = require('../utils/wrapAsync');
const auth = require('../controllers/auth');

router.get('/register', auth.renderRegisterForm)

router.post('/register', wrapAsync(auth.register))

router.get('/login', auth.renderLoginForm)

router.post('/login', passport.authenticate('local', {failuerRedirect: '/auth/login', failureFlash: true}), auth.login)

router.get('/logout', auth.logout)

module.exports = router;