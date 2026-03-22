const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require("../Utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const usersController = require("../controllers/users.js")

router.get("/signup", usersController.renderSignUpForm);

router.post("/signup", wrapAsync(usersController.signUp));

router.get("/login" ,usersController.renderLoginForm);

router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login", faliureFlash: true}),wrapAsync(usersController.login));

router.get("/logout", usersController.logoutForm);

module.exports = router;