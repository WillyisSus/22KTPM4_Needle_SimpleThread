const express = require('express');
const router = express.Router();
const createController = require('../controller/threadCreateController');

router.get('/cur-profile', createController.getCurrentUserThreads);
router.get('/profile/:user_id', createController.getUserThreads);
router.get('/feed', createController.getFeedThreads);
router.get('/api/:thread_id', createController.getReplies);

router.post('/post', createController.postNewThread);
router.post('/reply', createController.postThreadReply)
router.post('/like/:thread_id', createController.like)


module.exports = router;