const controller = {};
const models = require('../models');
const bcrypt = require('bcrypt')
const passport = require('passport');
const initializePassport = require('../passport-config');
const { validationResult } = require('express-validator');

initializePassport(passport);
controller.showSignup = (req, res) => {
    res.render("signup", { layout: "logged-out-layout" });
}
controller.showLogin = (req, res) => {
    res.render("login", { layout: "logged-out-layout" });
}
controller.showForgot = (req, res) => {
    res.render("forgotpw", { layout: "logged-out-layout" });
}

controller.getSignup = async (req, res) => {
    if (res.locals.message) {
        console.log(res.locals.message);
        return res.render("signup", { layout: "logged-out-layout", message: res.locals.message });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.Password, 10);
        models.User.create({
            username: req.body.Username,
            display_name: req.body.Username,
            email: req.body.Email,
            password: hashedPassword
        })
        res.redirect("/auth/login");
    } catch (error) {
        console.log(error);
        res.redirect("/auth/signup");
    }
}

controller.getLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/signup',
        failureFlash: true
    })(req, res, next);
}

controller.handleError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let message  = "";
        errors.array().forEach(error => {
            message += error.msg + "<br>";
        });
        res.locals.message = message;
    }
    next();
}

module.exports = controller;