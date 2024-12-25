const express = require("express");
const router = express.Router();
const controller = require("../controllers/curProfileController");

router.get("/", controller.show);
// router.post("/", controller.addUser);
router.put("/", controller.put);
router.delete("/avatar", controller.deleteAvatar);

module.exports = router;
