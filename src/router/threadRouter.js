const express = require('express');
const multer = require('multer')
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage:storage})
const router = express.Router();
const createController = require('../controller/threadCreateController');

router.post('/post', upload.single('file'), createController.postNewThread);
router.post('/reply', createController.postThreadReply)



module.exports = router;