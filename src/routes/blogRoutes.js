const express = require('express');
const blogController = require('../controllers/blogController');
const requireAuth = require('../middleware/requireAuth');
const adminAuth = require('../middleware/adminAuth')

const router = express.Router();

router.post('/',requireAuth, adminAuth, blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlog);
router.patch('/:id',requireAuth, adminAuth, blogController.updateBlog);
router.delete('/:id', requireAuth, adminAuth, blogController.deleteBlog);

module.exports = router;
