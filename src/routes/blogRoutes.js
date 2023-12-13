const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { checkAuthentication } = require("../middleware/requireAuth");
const { authenticateAdmin } = require("../middleware/adminAuth");

const router = express.Router();

// router.post('/blog',requireAuth, adminAuth, createBlog);
router.post("/blog", checkAuthentication(), authenticateAdmin(), createBlog);
router.get("/blog", getAllBlogs);
router.get("/blog/:id", getBlog);
// router.patch('/blog/:id',requireAuth, adminAuth, updateBlog);
// router.delete('/blog/:id', requireAuth, adminAuth, deleteBlog);

module.exports = router;
