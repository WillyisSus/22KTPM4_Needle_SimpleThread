const express = require('express');
const router = express.Router();
const createController = require('../controller/threadCreateController');

router.get('/cur-profile', createController.getCurrentUserThreads);
router.get('/feed', createController.getFeedThreads);

router.post('/post', createController.postNewThread);
router.post('/reply', createController.postThreadReply)

module.exports = router;