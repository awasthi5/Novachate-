const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { getIo, onlineUsers } = require('../socket/socket');

const getMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const messages = await Message.find({ conversation: req.params.conversationId })
            .populate('sender', 'name username avatar')
            .populate('receiver', 'name username avatar')
            .populate('replyTo')
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit);

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { receiverId, text, replyTo } = req.body;
        let { conversationId } = req.body;

        if (!conversationId && receiverId) {
            let conversation = await Conversation.findOne({
                participants: { $all: [req.user._id, receiverId] }
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [req.user._id, receiverId]
                });
            }
            conversationId = conversation._id;
        }

        if (!conversationId || !receiverId) {
            return res.status(400).json({ message: 'Conversation ID and Receiver ID are required' });
        }

        let attachments = [];
        if (req.files && req.files.length > 0) {
            attachments = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: `/uploads/${file.filename}`
            }));
        }

        const message = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            conversation: conversationId,
            text,
            attachments,
            replyTo: replyTo || null
        });

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: message._id
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name username avatar')
            .populate('receiver', 'name username avatar')
            .populate('replyTo');

        // Emit real-time Socket.IO notification to recipient and room
        try {
            const io = getIo();
            if (io) {
                const convIdStr = conversationId.toString();
                const recIdStr = receiverId.toString();

                io.to(convIdStr).emit('receiveMessage', populatedMessage);

                const receiverSocketId = onlineUsers.get(recIdStr);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('receiveMessage', populatedMessage);
                }
            }
        } catch (socketErr) {
            console.error('Socket emit error in sendMessage:', socketErr.message);
        }

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const editMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this message' });
        }

        message.text = text;
        message.isEdited = true;
        const updatedMessage = await message.save();

        const populated = await Message.findById(updatedMessage._id)
            .populate('sender', 'name username avatar')
            .populate('receiver', 'name username avatar')
            .populate('replyTo');

        try {
            const io = getIo();
            if (io) {
                io.to(message.conversation.toString()).emit('messageUpdated', populated);
                const recSocketId = onlineUsers.get(message.receiver.toString());
                if (recSocketId) {
                    io.to(recSocketId).emit('messageUpdated', populated);
                }
            }
        } catch (socketErr) {
            console.error('Socket emit error in editMessage:', socketErr.message);
        }

        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this message' });
        }

        message.isDeleted = true;
        message.text = 'This message was deleted';
        message.attachments = [];
        await message.save();

        try {
            const io = getIo();
            if (io) {
                const payload = { messageId: message._id, conversationId: message.conversation };
                io.to(message.conversation.toString()).emit('messageDeleted', payload);
                const recSocketId = onlineUsers.get(message.receiver.toString());
                if (recSocketId) {
                    io.to(recSocketId).emit('messageDeleted', payload);
                }
            }
        } catch (socketErr) {
            console.error('Socket emit error in deleteMessage:', socketErr.message);
        }

        res.json({ message: 'Message deleted successfully', data: message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMessages, sendMessage, editMessage, deleteMessage };
