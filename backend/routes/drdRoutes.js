const express = require('express');
const router = express.Router();
const {
  searchByRego,
  searchBySize,
  selectVariant
} = require('../controllers/drdController');

// 🔍 Search by rego
router.post('/search-by-rego', searchByRego);



module.exports = router;
