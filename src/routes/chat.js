const express = require("express");
const mongoose = require("mongoose");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const Message = require("../models/message");
const router = express.Router();

router.use(userAuth);
router.use("/:userId", async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if (!mongoose.isObjectIdOrHexString(userId) || String(req.user._id) === userId) {
            return res.status(400).json({ message: "Choose a valid connection." });
        }
        const connection = await ConnectionRequest.exists({
            status: "accepted",
            $or: [
                { fromUserId: req.user._id, toUserId: userId },
                { fromUserId: userId, toUserId: req.user._id },
            ],
        });
        if (!connection) return res.status(403).json({ message: "Chat is only available with accepted connections." });
        req.chatUserId = userId;
        next();
    } catch {
        res.status(500).json({ message: "Unable to open chat. Please try again." });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const filter = { $or: [
            { senderId: req.user._id, recipientId: req.chatUserId },
            { senderId: req.chatUserId, recipientId: req.user._id },
        ] };
        if (req.query.before) {
            if (!mongoose.isObjectIdOrHexString(req.query.before)) return res.status(400).json({ message: "Invalid message cursor." });
            filter._id = { $lt: req.query.before };
        }
        const messages = await Message.find(filter).sort({ _id: -1 }).limit(51).select("senderId recipientId text createdAt").lean();
        const hasMore = messages.length > 50;
        res.json({ data: messages.slice(0, 50).reverse(), hasMore });
    } catch {
        res.status(500).json({ message: "Unable to load messages. Please try again." });
    }
});

router.post("/:userId", async (req, res) => {
    const text = req.body?.text;
    if (typeof text !== "string" || !text.trim() || text.trim().length > 2000) {
        return res.status(400).json({ message: "Enter a message between 1 and 2000 characters." });
    }
    try {
        const message = await Message.create({ senderId: req.user._id, recipientId: req.chatUserId, text: text.trim() });
        res.status(201).json({ data: message });
    } catch {
        res.status(500).json({ message: "Message was not sent. Please try again." });
    }
});
module.exports = router;
