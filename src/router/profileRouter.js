const express = require("express");
const router = express.Router();
const controller = require("../controller/profileController.js");

router.get("/:username", controller.show);
router.post("/follow/:username", controller.follow);
router.delete("/follow/:username", controller.unfollow);



module.exports = router;
