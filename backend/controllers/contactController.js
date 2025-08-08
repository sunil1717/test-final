const ContactMessage = require("../models/ContactMessage");

// ➤ Save new message
exports.sendMessage = async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newMessage = new ContactMessage({ email, subject, message });
    await newMessage.save();
    res.status(201).json({ success: true, message: "Message sent successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message." });
  }
};

// ➤ Get all messages (admin use)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages." });
  }
};

// ➤ Delete one message by ID
exports.deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    await ContactMessage.findByIdAndDelete(id);
    res.json({ success: true, message: "Message deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message." });
  }
};

// ➤ Delete all messages
exports.clearAllMessages = async (req, res) => {
  try {
    await ContactMessage.deleteMany({});
    res.json({ success: true, message: "All messages cleared." });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear messages." });
  }
};
