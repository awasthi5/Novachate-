const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const checkDb = (res) => {
    if (mongoose.connection.readyState !== 1) {
        res.status(503).json({
            message: 'Database not connected yet. Please add 0.0.0.0/0 in MongoDB Atlas -> Network Access -> Add IP Address.'
        });
        return false;
    }
    return true;
};

const register = async (req, res) => {
    try {
        if (!checkDb(res)) return;
        const { name, username, email, password, confirmPassword } = req.body;

        if (!name || !username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        const user = await User.create({ name, username, email, password });
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            status: user.status,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        if (!checkDb(res)) return;
        const { username, email, password } = req.body;
        const loginIdentifier = email || username;

        if (!loginIdentifier || !password) {
            return res.status(400).json({ message: 'Please provide email/username and password' });
        }

        const user = await User.findOne({ $or: [{ email: loginIdentifier }, { username: loginIdentifier }] }).select('+password');

        if (user && (await user.comparePassword(password))) {
            user.isOnline = true;
            await user.save();

            const token = generateToken(user._id);
            res.json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                status: user.status,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id);
            if (user) {
                user.isOnline = false;
                user.lastSeen = Date.now();
                await user.save();
            }
        }
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, logout, getMe };
