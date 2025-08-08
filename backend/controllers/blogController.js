const Blog = require('../models/Blog');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });
exports.upload = upload.single('image');

exports.addBlog = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    let imageUrl = '';
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'blogs' },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const blog = new Blog({ title, description, image: imageUrl });
    await blog.save();
    res.status(201).json({ message: 'Blog added successfully', data: blog });
  } catch (err) {
    console.error('Error adding blog:', err);
    res.status(500).json({ error: 'Failed to add blog' });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted', data: blog });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete blog' });
  }
};
