const router = require('express').Router();
const controller = require('../controller/searchController');
function checkAuthentication(req, res, next){
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect('/auth/login')
}
router.get("/", checkAuthentication, controller.showSearchPage);

module.exports = router;