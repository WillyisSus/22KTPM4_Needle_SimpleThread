const router = require('express').Router();
const controller = require('../controller/notificationController');

router.get("/", controller.showNotif);

router.post("/mark", controller.markRead);
router.post("/del", controller.markDel);

module.exports = router;