const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const users = await User.find({ _id: { $ne: req.user._id } })
            .select('-password')
            .skip(skip)
            .limit(limit);

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, username, bio, email } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) return res.status(400).json({ message: 'Username already taken' });
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(400).json({ message: 'Email already taken' });
        }

        user.name = name || user.name;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.email = email || user.email;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.avatar = `/uploads/${req.file.filename}`;
        const updatedUser = await user.save();

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchUsers = async (req, res) => {
    try {
        const keyword = req.query.q ? {
            $or: [
                { name: { $regex: req.query.q, $options: 'i' } },
                { username: { $regex: req.query.q, $options: 'i' } }
            ]
        } : {};

        const users = await User.find({ ...keyword, _id: { $ne: req.user._id } })
            .select('-password')
            .limit(20);

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, getUserById, updateProfile, updateAvatar, searchUsers };
