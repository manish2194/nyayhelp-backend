const blogService = require("../services/blogService");
const { pageSizeCalculation } = require("../utils/index");
const { buildResponse, buildError } = require("../utils/responseBuilder");
const { BadRequest } = require("../error");

exports.createBlog = async (req, res) => {
  try {
    const blog = await blogService.createBlog(req.body);
    res.status(201).json({ blog });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getBlogs = async (req, res) => {
  try {
    let { page_number: reqPage = 1, page_size: reqPageSize = 10 } = req.query;
    let paginationConfig = pageSizeCalculation(reqPage, reqPageSize);
    const { skipCount = 0, page, page_size } = paginationConfig;
    const { blogs, total_count } = await blogService.getBlogs(
      skipCount,
      page_size
    );
    res.json(buildResponse({ blogs, total_count, page, page_size }));
  } catch (err) {
    res.status(400).send(buildError(err));
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    if (!blog) {
      throw new BadRequest(`Blog does not exist`);
    }
    res.json(buildResponse({ blog }));
  } catch (err) {
    res.status(400).send(buildError(err));
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await blogService.updateBlog(req.params.id, req.body);
    if (!blog) {
      throw new BadRequest(`Blog does not exist`);
    }
    res.json(buildResponse({ blog }));
  } catch (err) {
    res.status(400).send(buildError(err));
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await blogService.deleteBlog(req.params.id);
    res.status(204).send("Blog deleted successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
};
