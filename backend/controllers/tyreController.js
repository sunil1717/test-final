const Tyre = require('../models/Tyre');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');

// Multer config to handle file in memory (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });
exports.upload = upload.single('image');

// ✅ Add a new tyre with image upload to Cloudinary
exports.addTyre = async (req, res) => {
  try {
    const { brand, model, width, profile, rimSize, price } = req.body;

    if (!brand || !model || !width || !profile || !rimSize || !price) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let imageUrl = '';
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'tyres' },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    const tyre = new Tyre({
      brand,
      model,
      width,
      profile,
      rimSize,
      price,
      image: imageUrl,
    });

    await tyre.save();
    res.status(201).json({ message: 'Tyre added successfully', data: tyre });
  } catch (err) {
    console.error('Error adding tyre:', err);
    res.status(500).json({ error: 'Failed to add tyre' });
  }
};

// ✅ Get all tyres
exports.getAllTyres = async (req, res) => {
  try {
    const tyres = await Tyre.find();
    res.status(200).json({ success: true, data: tyres });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch tyres', error: err.message });
  }
};

// ✅ Get tyre by ID
exports.getTyreById = async (req, res) => {
  try {
    const tyre = await Tyre.findById(req.params.id);
    if (!tyre) {
      return res.status(404).json({ success: false, message: 'Tyre not found' });
    }
    res.status(200).json({ success: true, data: tyre });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch tyre', error: err.message });
  }
};

// ✅ Update tyre
exports.updateTyre = async (req, res) => {
  try {
    const updatedTyre = await Tyre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTyre) {
      return res.status(404).json({ success: false, message: 'Tyre not found' });
    }
    res.status(200).json({ success: true, message: 'Tyre updated successfully', data: updatedTyre });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update tyre', error: err.message });
  }
};

// ✅ Delete tyre
exports.deleteTyre = async (req, res) => {
  try {
    const deletedTyre = await Tyre.findByIdAndDelete(req.params.id);
    if (!deletedTyre) {
      return res.status(404).json({ success: false, message: 'Tyre not found' });
    }
    res.status(200).json({ success: true, message: 'Tyre deleted successfully', data: deletedTyre });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete tyre', error: err.message });
  }
};

// ✅ Toggle stock status
exports.toggleTyreStock = async (req, res) => {
  try {
    const tyre = await Tyre.findById(req.params.id);
    if (!tyre) {
      return res.status(404).json({ success: false, message: 'Tyre not found' });
    }

    tyre.inStock = !tyre.inStock;
    await tyre.save();

    res.status(200).json({
      success: true,
      message: `Tyre marked as ${tyre.inStock ? 'in stock' : 'out of stock'}`,
      data: tyre,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to toggle stock status', error: err.message });
  }
};
// Get recommended tyres (any 4 tyres that are in stock)
exports.getRecommendedTyres = async (req, res) => {
  try {
    const tyres = await Tyre.find({ inStock: true }).limit(4);
    res.status(200).json(tyres);
  } catch (err) {
    console.error("Error fetching recommended tyres:", err);
    res.status(500).json({ error: 'Failed to fetch recommended tyres' });
  }
};

