require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Create JWT token
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  return res.status(200).json({
    message: 'Admin login successful',
    token,
  });
};
