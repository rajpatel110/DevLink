const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true });
messageSchema.index({ senderId: 1, recipientId: 1, _id: -1 });
module.exports = mongoose.model("Message", messageSchema);
