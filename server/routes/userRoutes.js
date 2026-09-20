const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getUsers, getUserById, updateProfile, updateAvatar, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename(req, file, cb) {
        cb(null, `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

router.use(protect);
router.get('/', getUsers);
router.get('/search', searchUsers);
router.get('/:id', getUserById);
router.put('/profile', updateProfile);
router.put('/avatar', upload.single('avatar'), updateAvatar);

module.exports = router;
