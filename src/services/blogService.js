const Blog = require("../models/blogModel");

const createBlog = async (blogData) => {
  return await Blog.create(blogData);
};

const getBlogs = async (skipCount, page_size) => {
  const [blogs, totalItems] = await Promise.allSettled([
    Blog.find()
      .skip(skipCount)
      .limit(page_size)
      .populate("author", (select = ["user_name"])),
    Blog.countDocuments(),
  ]);
  return { blogs: blogs.value, total_count: totalItems.value };
};

const getBlogById = async (id) => {
  return await Blog.findById(id).populate("author", (select = ["user_name"]));
};

const updateBlog = async (id, blogData) => {
  return await Blog.findByIdAndUpdate(id, blogData, {
    new: true,
    runValidators: true,
  });
};

const deleteBlog = async (id) => {
  await Blog.findByIdAndDelete(id);
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
