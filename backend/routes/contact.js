const express = require("express");
const router = express.Router();
const {sendMessage,getAllMessages,deleteMessage,clearAllMessages} = require("../controllers/contactController");
const { verifyAdmin } = require('../middleware/adminVerify');


router.post("/send", sendMessage);         // User sends message
router.get("/all",verifyAdmin , getAllMessages);        // Admin views all
router.delete("/:id",verifyAdmin , deleteMessage);      // Admin deletes one
router.delete("/",verifyAdmin , clearAllMessages);      // Admin clears all

module.exports = router;
