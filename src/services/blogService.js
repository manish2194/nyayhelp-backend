const Blog = require("../models/blogModel");

exports.createBlog = async (blogData) => {
  return await Blog.create(blogData);
};

exports.getAllBlogs = async () => {
  return await Blog.find().populate("author", (select = ["user_name"]));
};

exports.getBlogById = async (id) => {
  return await Blog.findById(id).populate("author", (select = ["user_name"]));
};

exports.updateBlog = async (id, blogData) => {
  return await Blog.findByIdAndUpdate(id, blogData, {
    new: true,
    runValidators: true,
  });
};

exports.deleteBlog = async (id) => {
  await Blog.findByIdAndDelete(id);
};
