const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/adminVerify');
const {
  addBlog,
  getBlogs,
  deleteBlog,
  upload
} = require('../controllers/blogController');

router.post('/add', verifyAdmin, upload, addBlog);
router.get('/getall', getBlogs);
router.delete('/:id', verifyAdmin, deleteBlog);

module.exports = router;