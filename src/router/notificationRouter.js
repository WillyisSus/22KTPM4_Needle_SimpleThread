const router = require('express').Router();
const controller = require('../controller/notificationController');
function checkAuthentication(req, res, next){
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect('/auth/login')
}
router.get("/", checkAuthentication, controller.showNotif);

router.post("/mark", controller.markRead);
router.post("/del", controller.markDel);

module.exports = router;