const express = require("express");
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { checkAuthentication } = require("../middleware/requireAuth");
const { authenticateAdmin } = require("../middleware/adminAuth");

const router = express.Router();

// router.post('/',requireAuth, adminAuth, createBlog);
router.post("/", checkAuthentication(), authenticateAdmin(), createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlog);
// router.patch('/:id',requireAuth, adminAuth, updateBlog);
// router.delete('/:id', requireAuth, adminAuth, deleteBlog);

module.exports = router;
