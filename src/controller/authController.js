const controller = {};

const models = require('../models');
const bcrypt = require('bcrypt')
const passport = require('passport');
const initializePassport = require('../passport-config');
const { Op } = require('@sequelize/core')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const transporter = require('../email-config');
const { where } = require('sequelize');
initializePassport(passport);

controller.showSignup = (req, res) => {
    res.render("signup", { layout: "logged-out-layout" });
}
controller.showLogin = (req, res) => {
    res.render("login", { layout: "logged-out-layout" });
}
controller.showForgot = (req, res) => {
    res.render("forgotpw", { layout: "logged-out-layout", emailNotSent: true });
}

controller.getSignup = async (req, res) => {
    if (res.locals.message) {
        console.log(res.locals.message);
        return res.render("signup", { layout: "logged-out-layout", message: res.locals.message });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.Password, 10);
        const usernameInDB = await models.User.findOne({
            where: { username: req.body.Username }
        })
        if (usernameInDB != null) {
            return res.render("signup", { layout: "logged-out-layout", message: "Username has been used" });
        }
        const emailInDB = await models.User.findOne({
            where: { email: req.body.Email }
        })
        if (emailInDB != null) {
            return res.render("signup", { layout: "logged-out-layout", message: "Email has been used" });
        }

        const unverifiedEmail = req.body.Email + "%" + Date.now();
        await models.User.create({
            username: req.body.Username,
            display_name: req.body.Username,
            email: unverifiedEmail,
            avatar: '/images/avatar.png',
            password: hashedPassword
        })
        console.log(process.env.CRYPTO_PASSWORD)
        const param = req.body.Email
        const sign = jwt.sign({ data: param }, process.env.CRYPTO_PASSWORD, { expiresIn: '5m' })
        const protocol = req.protocol;
        const host = req.hostname;
        const port = 3000;
        const fullUrl = `${protocol}://${host}${process.env.NODE_ENV=="production"?"":":" + port}/auth/verify-email/${sign}`
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

controller.getLogin = (req, res) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res);
}


controller.handleError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let message = "";
        errors.array().forEach(error => {
            message += error.msg + "<br>";
        });
        res.locals.message = message;
    }
    next();
}

controller.showVerifyEmail = (req, res, next) => {
    var query = req.query;
    var isRequest = (query.userRequest ? query.userRequest : false);
    return res.render('verifyemail', { layout: "logged-out-layout", message: "Please confirm your email to use email for login and password reset", userRequest: isRequest })
}

controller.sendVerifyEmail = async (req, res, next) => {
    var email = req.body;
    console.log(email)
    const user = await models.User.findOne({
        where: {
            email: {
                [Op.like]: email.Email + "%"
            }
        }
    });
    if (user) {
        if (user.email.search("%") != -1) {
            const sign = jwt.sign({ data: email }, process.env.CRYPTO_PASSWORD, { expiresIn: '5m' })
            const protocol = req.protocol;
            const host = req.hostname;
            const port = 3000;
            const fullUrl = `${protocol}://${host}${process.env.NODE_ENV=="production"?"":":" + port}/auth/verify-email/${sign}`
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

            return res.render('verifyemail', { layout: "logged-out-layout", message: "Please check your email, this verification link will be expired after 5 minutes", userRequest: false })

        } else {
            return res.render('verifyemail', { layout: "logged-out-layout", message: "Your email has already been verified, please return to login page", userRequest: false })

        }

    }
}

controller.verifyEmail = async (req, res) => {
    const params = req.params
    var crypted = (params.crypted ? params.crypted : "");
    var email;
    if (crypted.length > 0) {
        jwt.verify(crypted, process.env.CRYPTO_PASSWORD, function (err, decoded) {
            if (err) {
                return res.render('verifyemail', { layout: "logged-out-layout", message: "Email verification failed, the link is expired or bad token" })
            } else {
                email = decoded.data
            }
        })
        if (email) {
            try {
                const user = await models.User.findOne({
                    where: {
                        email: {
                            [Op.like]: email + "%",
                        }
                    }
                })
                if (user) {
                    await models.User.update(
                        {
                            email: email,
                        },
                        {
                            where: { user_id: user.user_id }
                        }
                    )
                }
                res.render('verifyemail', { layout: "logged-out-layout", message: "Your email is verified, you can use it to reset password and login now" })

            } catch (error) {
                console.log(error)
                res.redirect('/auth/signup')
            }

        }
    } else {
        res.redirect('/auth/login')
    }
}

controller.sendForgotPasswordForm = async (req, res) => {
    const { UsernameOrEmail = "" } = req.body;
    var user;
    if (UsernameOrEmail.length > 0) {
        if (UsernameOrEmail.search("@") != -1) {
            user = await models.User.findOne({
                where: {
                    [Op.or]: {
                        email: {
                            [Op.like]: UsernameOrEmail + "%"
                        },
                        username: UsernameOrEmail
                    }
                }

            });
        } else {
            user = await models.User.findOne({
                where:
                {
                    [Op.or]:
                {
                    username: UsernameOrEmail,
                    email: UsernameOrEmail
                }
                }
            });
        }
        if (user) {
            if (user.email.search("%") != -1) {
                console.log("Not verify")
                res.render('forgotpw', { layout: "logged-out-layout", message: "Your email is not verified, please verify it first ", emailNotSent: true, })
            } else {
                var sign = jwt.sign({ data: user.email }, process.env.CRYPTO_PASSWORD, { expiresIn: '5m' })
                const protocol = req.protocol;
                const host = req.hostname;
                const port = 3000;
                const fullUrl = `${protocol}://${host}:${port}/auth/forgot-password/${sign}`
                transporter.sendMail({
                    from: {
                        name: 'Needle - Simple Thread',
                        address: process.env.APP_EMAIl,
                    },
                    to: user.email,
                    subject: "[Needle - Simple Thread] Reset your password",
                    text: "Plaintext version of the message",
                    html: `<div><span style="color:#FF0000">Please ignore this email if you did not request this.</span> Follow this link to reset your password, or it will be canceled after 5 minutes: 
                                <a href="${fullUrl}">To reset your password</a></div>`,
                })
                res.render('forgotpw', { layout: "logged-out-layout", emailNotSent: false })
            }
        } else {
            return res.render('forgotpw', { layout: "logged-out-layout", emailNotSent: true, message: "Cannot find Username or Email" })
        }
    }

}

controller.showRequestPasswordForm = async (req, res) => {
    const { token = "" } = req.params;
    var user;
    if (token.length > 0) {
        jwt.verify(token, process.env.CRYPTO_PASSWORD, function (err, decoded) {
            if (err) {
                return res.render('resetpassword', { layout: "logged-out-layout", expiredMessage: "The link is expired or bad token" })
            } else {
                return res.render('resetpassword', { layout: "logged-out-layout", actionTo: `/auth/reset-password/${token}` })
            }
        })
    } else {
        return res.render('resetpassword', { layout: "logged-out-layout", expiredMessage: "The link is expired or bad token" })
    }

}

controller.changeUserPassword = async (req, res) => {
    const { token = "" } = req.params;
    const body = req.body;
    console.log(body)
    var email;
    if (token.length > 0) {
        jwt.verify(token, process.env.CRYPTO_PASSWORD, function (err, decoded) {
            if (err) {
                return res.render('/auth/forgot-password/badtoken')
            } else {
                email = decoded.data;
            }
        })
        if (email) {
            try {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                await models.User.update({ password: hashedPassword }, { where: { email: email } })
                res.redirect(200, '/auth/login')
            } catch (error) {
                res.status(500).send("Something bad happened")
            }
        }
    } else {
        return res.render('resetpassword', { layout: "logged-out-layout", expiredMessage: "The link is expired or bad token" })
    }
}

controller.logOutUser = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });

}
module.exports = controller;