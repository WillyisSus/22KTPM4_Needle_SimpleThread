const express = require("express");
const router = express.Router();
const controller = require("../controller/curProfileController");

router.get("/", controller.show);
router.get("/followers", controller.getFollowers);
router.get("/followees", controller.getFollowees);
// router.post("/", controller.addUser);
router.put("/", controller.put);
router.delete("/avatar", controller.deleteAvatar);

module.exports = router;
