const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateItem,
  removeItem,
  clearCart
} = require('../controllers/cartController');

// ✅ Add tyre to cart
router.post('/add', addToCart);

// ✅ Get full cart for a user by phone
router.get('/:phone', getCart);

// ✅ Update quantity of an item
router.put('/update', updateItem);

// ✅ Remove an item from the cart
router.delete('/remove', removeItem);

// ✅ Clear all items in user's cart
router.delete('/clear/:phone', clearCart);

module.exports = router;
