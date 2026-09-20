const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getMessages, sendMessage, editMessage, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename(req, file, cb) {
        cb(null, `msg_${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

router.use(protect);
router.get('/:conversationId', getMessages);
router.post('/', upload.array('attachments', 5), sendMessage);
router.put('/:id', editMessage);
router.delete('/:id', deleteMessage);

module.exports = router;
