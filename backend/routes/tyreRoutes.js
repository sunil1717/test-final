const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyAdmin } = require("../middleware/adminVerify");
const {
  addTyre,
  getAllTyres,
  getTyreById,
  updateTyre,
  deleteTyre,
  toggleTyreStock,
  getRecommendedTyres,
  upload // ← imported from controller (uses memory storage)
} = require('../controllers/tyreController');

// ✅ Add tyre (image upload handled by multer + Cloudinary in controller)
router.post('/add', verifyAdmin, upload, addTyre);

// ✅ Get all tyres (public or admin)
router.get('/getall', getAllTyres);

//✅ recommended tyre 
router.get('/recommended', getRecommendedTyres);

// ✅ Get single tyre by ID
router.get('/:id', getTyreById);

// ✅ Update tyre (no image update here)
router.put('/:id', verifyAdmin, updateTyre);

// ✅ Delete tyre
router.delete('/:id', verifyAdmin, deleteTyre);

// ✅ Toggle in-stock / out-of-stock
router.patch('/:id/toggle-stock', verifyAdmin, toggleTyreStock);



module.exports = router;
