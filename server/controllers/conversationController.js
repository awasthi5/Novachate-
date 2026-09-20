const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ participants: req.user._id })
            .populate('participants', 'name username avatar isOnline lastSeen')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        const convData = await Promise.all(conversations.map(async (conv) => {
            const unreadCount = await Message.countDocuments({
                conversation: conv._id,
                receiver: req.user._id,
                isRead: false
            });
            return { ...conv.toObject(), unreadCount };
        }));

        res.json(convData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createConversation = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [req.user._id, userId] }
        });

        if (conversation) {
            conversation = await Conversation.findById(conversation._id)
                .populate('participants', 'name username avatar isOnline lastSeen')
                .populate('lastMessage');
            return res.json(conversation);
        }

        conversation = await Conversation.create({
            participants: [req.user._id, userId]
        });

        conversation = await Conversation.findById(conversation._id)
            .populate('participants', 'name username avatar isOnline lastSeen');

        res.status(201).json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getConversationById = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id)
            .populate('participants', 'name username avatar isOnline lastSeen')
            .populate('lastMessage');

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to delete this conversation' });
        }

        await Message.deleteMany({ conversation: conversation._id });
        await Conversation.findByIdAndDelete(req.params.id);

        res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getConversations, createConversation, getConversationById, deleteConversation };
