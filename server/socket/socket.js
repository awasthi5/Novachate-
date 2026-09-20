const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

const onlineUsers = new Map();
let ioInstance = null;

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || '*',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    ioInstance = io;

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) return next(new Error('Authentication error: No token provided'));

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (error) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', async (socket) => {
        onlineUsers.set(socket.userId, socket.id);

        try {
            await User.findByIdAndUpdate(socket.userId, { isOnline: true });
        } catch (err) {
            console.error('Error updating user online status:', err.message);
        }

        // Send existing online users to the newly connected client
        socket.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
        // Broadcast to all other clients that this user is online
        io.emit('userOnline', socket.userId);

        socket.on('joinConversation', (conversationId) => {
            if (conversationId) {
                socket.join(conversationId.toString());
            }
        });

        socket.on('leaveConversation', (conversationId) => {
            if (conversationId) {
                socket.leave(conversationId.toString());
            }
        });

        socket.on('sendMessage', (messageData) => {
            if (!messageData) return;
            const conversationId = (messageData.conversation?._id || messageData.conversation || '').toString();
            const receiverId = (messageData.receiver?._id || messageData.receiver || '').toString();

            if (conversationId) {
                io.to(conversationId).emit('receiveMessage', messageData);
            }

            if (receiverId) {
                const receiverSocketId = onlineUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('receiveMessage', messageData);
                }
            }
        });

        socket.on('typing', ({ conversationId, receiverId }) => {
            if (conversationId) {
                socket.to(conversationId.toString()).emit('typing', { conversationId, userId: socket.userId });
            }
            if (receiverId) {
                const receiverSocketId = onlineUsers.get(receiverId.toString());
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('typing', { conversationId, userId: socket.userId });
                }
            }
        });

        socket.on('stopTyping', ({ conversationId, receiverId }) => {
            if (conversationId) {
                socket.to(conversationId.toString()).emit('stopTyping', { conversationId, userId: socket.userId });
            }
            if (receiverId) {
                const receiverSocketId = onlineUsers.get(receiverId.toString());
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('stopTyping', { conversationId, userId: socket.userId });
                }
            }
        });

        socket.on('messageRead', async ({ messageIds, conversationId, senderId }) => {
            if (messageIds && messageIds.length > 0) {
                try {
                    await Message.updateMany(
                        { _id: { $in: messageIds } },
                        { $set: { isRead: true } }
                    );
                } catch (err) {
                    console.error('Error marking messages as read:', err.message);
                }
            }

            if (conversationId) {
                socket.to(conversationId.toString()).emit('messageRead', { messageIds, conversationId });
            }

            if (senderId) {
                const senderSocketId = onlineUsers.get(senderId.toString());
                if (senderSocketId) {
                    io.to(senderSocketId).emit('messageRead', { messageIds, conversationId });
                }
            }
        });

        socket.on('disconnect', async () => {
            onlineUsers.delete(socket.userId);
            try {
                await User.findByIdAndUpdate(socket.userId, {
                    isOnline: false,
                    lastSeen: Date.now()
                });
            } catch (err) {
                console.error('Error updating user offline status:', err.message);
            }
            io.emit('userOffline', socket.userId);
        });
    });

    return io;
};

const getIo = () => ioInstance;

module.exports = { initializeSocket, onlineUsers, getIo };
