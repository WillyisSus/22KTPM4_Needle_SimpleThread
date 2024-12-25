const controller = {};

const models = require('../models');
const bcrypt = require('bcrypt')
const passport = require('passport');
const initializePassport = require('../passport-config');
const {Op} = require('@sequelize/core')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')


const transporter = require('../email-config');
const { prototype } = require('nodemailer/lib/dkim');
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
        const usernameInDB = await models.User.findOne({
            where: {username: req.body.Username}
        })
        if (usernameInDB != null){
            return res.render("signup", { layout: "logged-out-layout", message: "Username has been used" });
        }
        const emailInDB = await models.User.findOne({
            where: {email: req.body.Email}
        })
        if (emailInDB != null){
            return res.render("signup", { layout: "logged-out-layout", message: "Email has been used" });
        }
        // await models.User.create({
        //     username: req.body.Username,
        //     display_name: req.body.Username,
        //     email: req.body.Email,
        //     password: hashedPassword
        // })
        const param = req.body.Email
        const sign = jwt.sign(param, process.env.CRYPTO_PASSWORD, {expiresIn: '5m'})
        const protocol = req.protocol;
        const host = req.hostname;
        const port = 3000;
        const fullUrl = `${protocol}://${host}:${port}/auth/verify-email/${sign}`
        await transporter.sendMail({
            from: {
                name: 'Needle - Simple Thread',
                address: process.env.APP_EMAIl,
            },
            to: req.body.Email,
            subject: "[Needle - Simple Thread] Confirm your email for our site",
            text: "Plaintext version of the message",
            html: `<div>Follow this link to confirm your account or it will be canceled after 5 minutes: 
                        <a href="${fullUrl}">To Confirm Email</a></div>`,
        })
        res.redirect("/auth/verify-email");
    } catch (error) {
        console.log(error);
        return res.render("signup", { layout: "logged-out-layout", message: "Something wrong happened" });
    }
}

controller.getLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
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

controller.showVerifyEmail = (req, res, next) => {
    return res.render('verifyemail', {layout: "logged-out-layout", message: "Please confirm your email to create account"})
}

controller.verifyEmail = async (req, res) => {
    const params = req.params
    var crypted = (params.crypted?params.crypted:"");
    if (crypted.length > 0){
        if (parts.length == 2){
            jwt.verify(crypted, process.env.CRYPTO_PASSWORD, function(err, decoded){
                if (err){
                    return res.render('verifyemail', {layout: "logged-out-layout", message: "Email verification failed, the link is expired or bad token"})
                }else{
                    return res.render('verifyemail', {layout: "logged-out-layout", message: "Your email is verified, you acn use it to reset password and login now"})
                }
            })
        }else return res.render('verifyemail', {layout: "logged-out-layout", message: "How can you get here?????"})
        
    }else {
        res.redirect('/auth/login')
    }
}
module.exports = controller;