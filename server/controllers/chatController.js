const router = require("express").Router();
const Chat = require("./../models/chatmodel");
const User = require("../models/usermodel");
const authMiddleware = require('./../middlewares/authMiddleware');

router.post("/create-new-chat", authMiddleware, async (req, res) => {
    try {
        const { email } = req.body;
        const senderId = req.user.userId; // ✅ Corrected here

        if (!email) {
            return res.status(400).send({ message: "Email is required", success: false });
        }

        const recipient = await User.findOne({ email });

        if (!recipient) {
            return res.status(404).send({ message: "User not found", success: false });
        }

        const recipientId = recipient._id;

        if (recipientId.toString() === senderId.toString()) {
            return res.status(400).send({ message: "You cannot start a chat with yourself", success: false });
        }

        const existingChat = await Chat.findOne({
            members: { $all: [senderId, recipientId] }
        });

        if (existingChat) {
            return res.status(200).send({ message: "Chat already exists", success: true, data: existingChat });
        }

        const chat = new Chat({ members: [senderId, recipientId] });

        const savedChat = await chat.save();

        res.status(201).send({
            message: "Chat created successfully",
            success: true,
            data: savedChat
        });

    } catch (error) {
        res.status(500).send({ message: "Error creating chat", success: false, error: error.message });
    }
});

router.get('/get-chat-of-user', authMiddleware, async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(400).send({ message: "Unidentified User", success: false });
        }

        const userId = req.user.userId;

        const allChats = await Chat.find({ members: { $in: [userId] } })
            .populate('members', 'name email');

        res.status(200).send({
            message: "Chats fetched successfully",
            success: true,
            data: allChats,
        });
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            success: false,
        });
    }
});

module.exports = router;
