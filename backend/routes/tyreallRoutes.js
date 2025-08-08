const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/tyreallController");

// Routes
router.get("/", getAllTyres);
router.post("/size", getTyresBySize);
router.get("/model/:model", getTyresByModel);
router.get("/type/:type", getTyresByType);
router.put("/update-stock/:id", updateInStock);

router.post("/add", upload, addTyre);
router.put("/update-image/:id", upload, updateTyreImage);
router.delete("/delete/:id", deleteTyre);
router.put("/update-prices/:id", updateTyrePrices);

module.exports = router;
