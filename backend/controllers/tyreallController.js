const Tyre = require("../models/Tyreall");
const cloudinary = require("../utils/cloudinary");
const multer = require("multer");




// Multer setup
const storage = multer.memoryStorage();
const uploads = multer({ storage });
const upload = uploads.single("image");




//  Add a new tyre
const addTyre = async (req, res) => {
  try {
    const {
      Brand, SIZE, Model, Type,
      "LOAD/SPEED RATING": rating,
      Marking, RunFlat,
      "Price Incl GST": price,
      "In Stock": inStock,
      "UNLOADING IN 24 HRS": unloading,
      "Price for 1": price1,
      "Price for 2": price2,
      "Price for 3": price3,
      "Price for 4": price4,
      "Price for 5": price5
    } = req.body;

    if (!Brand || !SIZE || !Model || !price || !inStock) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    let imageUrl = "";
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "tyres" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const tyre = new Tyre({
      Brand,
      SIZE,
      "LOAD/SPEED RATING": rating,
      Model,
      Type,
      Marking,
      RunFlat,
      "Price for 1": price1 || price, //  fallback to Price Incl GST
      "Price for 2": price2 || null,
      "Price for 3": price3 || null,
      "Price for 4": price4 || null,
      "Price for 5": price5 || null,
      "Price Incl GST": price,
      "In Stock": inStock,
      "UNLOADING IN 24 HRS": unloading,
      image_url: imageUrl,
    });

    await tyre.save();
    res.status(201).json({ message: "Tyre added successfully", data: tyre });
  } catch (err) {
    res.status(500).json({ error: "Failed to add tyre", details: err.message });
  }
};


//delete tyre 


const deleteTyre = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Tyre.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Tyre not found" });
    }
    res.json({ message: "Tyre deleted successfully", data: deleted });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete tyre", details: error.message });
  }
};



// Get all tyres

const getAllTyres = async (req, res) => {
  try {
  
    
    const tyres = await Tyre.find();
    res.json(tyres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get tyres by size
// Search tyres by width/profile/rim
const getTyresBySize = async (req, res) => {
  try {
    const { width, profile, rim } = req.body;

    if (!width || !profile || !rim) {
      return res.status(400).json({ error: "Missing width, profile or rim" });
    }

   
    const sizePattern = new RegExp(`^${width}/${profile}R${rim}$`, "i");

    const tyres = await Tyre.find({ SIZE: sizePattern });
    res.json(tyres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get tyres by model
const getTyresByModel = async (req, res) => {
  try {
    const model = req.params.model.toUpperCase();
    const tyres = await Tyre.find({ Model: new RegExp(model, "i") });
    res.json(tyres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get tyres by type
const getTyresByType = async (req, res) => {
  try {
    const type = req.params.type.toUpperCase();
    const tyres = await Tyre.find({ Type: new RegExp(type, "i") });
    res.json(tyres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update "In Stock" count
const updateInStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { inStock } = req.body;
    const updated = await Tyre.findByIdAndUpdate(id, { "In Stock":String(inStock)}, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//image update for a perticular tyre by admin

const updateTyreImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "tyres" },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    const updated = await Tyre.findByIdAndUpdate(
      id,
      { image_url: result.secure_url },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Tyre not found" });
    }

    res.json({ message: "Image updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update image", details: error.message });
  }
};

// Update tyre prices by admin
const updateTyrePrices = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = {};

    // Extract only relevant fields if they exist in request
    const allowedPriceFields = [
      "Price for 1",
      "Price for 2",
      "Price for 3",
      "Price for 4",
      "Price for 5"
    ];

    allowedPriceFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const updated = await Tyre.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updated) {
      return res.status(404).json({ error: "Tyre not found" });
    }

    res.json({ message: "Prices updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update prices", details: error.message });
  }
};



module.exports = {
  getAllTyres,
  getTyresBySize,
  getTyresByModel,
  getTyresByType,
  updateInStock,
  addTyre,
  deleteTyre,
  updateTyreImage,
  upload,
  updateTyrePrices
  
};
