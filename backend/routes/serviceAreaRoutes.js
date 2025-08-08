const express = require('express');
const router = express.Router();
const { checkServiceArea, addServiceArea, getServiceAreas,removeServiceArea } = require('../controllers/serviceAreaController');
const {verifyAdmin}=require("../middleware/adminVerify")

// Check if a postcode is serviceable
router.post('/check', checkServiceArea);

// (Optional) Admin can view or add serviceable postcodes
router.get('/',verifyAdmin,  getServiceAreas);
router.post('/add', verifyAdmin, addServiceArea);

router.post('/delete',verifyAdmin, removeServiceArea);


module.exports = router;
