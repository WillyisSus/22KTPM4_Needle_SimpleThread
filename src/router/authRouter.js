const router = require('express').Router();
const controller = require('../controller/authController');
const {body} = require('express-validator');
function checkNotAuthentication(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect('/')
    }
    next();
}
router.get("/signup", checkNotAuthentication, controller.showSignup);
router.get("/login",checkNotAuthentication, controller.showLogin);
router.get("/forgot-password",checkNotAuthentication, controller.showForgot);

router.post("/signup",
    body("Username").matches(/^[a-zA-Z0-9]{6,32}$/, "i").withMessage("Username must be between 6 to 32 characters and contain only letters and numbers."),
    body("Email").isEmail().withMessage("Email is required."),
    body("Password").matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%\.])[a-zA-Z0-9!@#$%\.]{8,32}$/, "i").withMessage("Password must be between 8 to 32 characters and contain at least one letter, one number, and one special character."),
    controller.handleError, controller.getSignup);

router.post("/login", controller.getLogin);
router.get("/verify-email", controller.showVerifyEmail);
router.get("/verify-email/:crypted", controller.verifyEmail)
router.post("/verify-email", controller.sendVerifyEmail)
router.post("/forgot-password", controller.sendForgotPasswordForm);
router.get("/forgot-password/:token", controller.showRequestPasswordForm);
router.post('/reset-password/:token', controller.changeUserPassword)
router.post('/logout', controller.logOutUser);
module.exports = router;