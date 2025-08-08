const Cart = require('../models/Cart');

// 📥 Add to Cart
exports.addToCart = async (req, res) => {
  const { phone, tyre, quantity } = req.body;

  if (!tyre || quantity < 1 || quantity > 5) {
    return res.status(400).json({ message: 'Invalid tyre or quantity' });
  }

  let cart = await Cart.findOne({ phone });

  if (!cart) {
    cart = new Cart({
      phone,
      items: [{ tyre, quantity }]
    });
  } else {
    const existing = cart.items.find(item =>
      item.tyre.width === tyre.width &&
      item.tyre.profile === tyre.profile &&
      item.tyre.rimSize === tyre.rimSize &&
      item.tyre.brand === tyre.brand &&
      item.tyre.model === tyre.model
    );

    if (existing) {
      existing.quantity += quantity; // ✅ increment quantity
      if (existing.quantity > 5) existing.quantity = 5; // enforce max 5
    } else {
      cart.items.push({ tyre, quantity });
    }
  }

  await cart.save();
  res.status(200).json(cart);
};

// 📦 Get Cart

exports.getCart = async (req, res) => {
  const { phone } = req.params;

  const cart = await Cart.findOne({ phone });
  if (!cart) {
    return res.status(200).json({ phone, items: [] });
  }

  const formattedItems = cart.items.map(item => ({
    _id: item._id,
    quantity: item.quantity,
    tyre: {
      ...item.tyre,
      totalPrice: item.tyre.price * item.quantity,
      unitPrice: item.tyre.price,
    },
  }));

  res.status(200).json({ phone: cart.phone, items: formattedItems });
};


// 🔁 Update Item Quantity
exports.updateItem = async (req, res) => {
  const { phone, itemId, quantity,updatedPrice } = req.body;

  if (quantity < 1 || quantity > 5) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }

  const cart = await Cart.findOne({ phone });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find(i => i._id.toString() === itemId);
  if (!item) return res.status(404).json({ message: 'Item not found in cart' });
  if (item) item.quantity = quantity;
   if (updatedPrice) {
    item.tyre.price = updatedPrice;
  }

  await cart.save();
  res.status(200).json(cart);
};


// ❌ Remove Item
exports.removeItem = async (req, res) => {
  const { phone, itemId } = req.body;

  const cart = await Cart.findOne({ phone });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(i => i._id.toString() !== itemId);
  await cart.save();

  res.status(200).json(cart);
};


// 🗑️ Clear Cart
exports.clearCart = async (req, res) => {
  const { phone } = req.params;

  const cart = await Cart.findOneAndUpdate({ phone }, { items: [] }, { new: true });
  res.status(200).json(cart);
};

