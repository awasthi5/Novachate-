const express = require('express');
const router = express.Router();
const { getConversations, createConversation, getConversationById, deleteConversation } = require('../controllers/conversationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id', getConversationById);
router.delete('/:id', deleteConversation);

module.exports = router;
