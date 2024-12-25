const express = require('express');
const router = express.Router();
const createController = require('../controller/threadCreateController');

router.post('/post',  createController.postNewThread);
router.post('/reply', createController.postThreadReply)

module.exports = router;