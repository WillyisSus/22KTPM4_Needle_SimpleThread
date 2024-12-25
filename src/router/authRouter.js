const router = require('express').Router();
const controller = require('../controller/authController');
const {body} = require('express-validator');

router.get("/signup", controller.showSignup);
router.get("/login", controller.showLogin);
router.get("/forgot-password", controller.showForgot);
router.get("/verify-email", controller.showVerifyEmail);

router.post("/signup",
    body("Username").matches(/^[a-zA-Z0-9]{6,32}$/, "i").withMessage("Username must be between 6 to 32 characters and contain only letters and numbers."),
    body("Email").isEmail().withMessage("Email is required."),
    body("Password").matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%\.])[a-zA-Z0-9!@#$%\.]{8,32}$/, "i").withMessage("Password must be between 8 to 32 characters and contain at least one letter, one number, and one special character."),
    controller.handleError, controller.getSignup);

router.post("/login", controller.getLogin);
router.get("/verify-email/:crypted", controller.verifyEmail)
// router.post("/forgot-password", controller.getForgotPassword);
module.exports = router;