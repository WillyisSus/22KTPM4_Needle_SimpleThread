const router = require('express').Router();
const controller = require('../controller/notificationController');

router.get("/", controller.showNotif);

module.exports = router;