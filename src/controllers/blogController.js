const Blog = require('../models/blogModel');
const blogService = require('../services/blogService');

exports.createBlog = async (req, res) => {
    try {
        const blog = await blogService.createBlog(req.body);
        res.status(201).json({ blog });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await blogService.getAllBlogs();
        res.status(200).json({ blogs });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.getBlog = async (req, res) => {
    try {
        const blog = await blogService.getBlogById(req.params.id);
        if (!blog) {
            return res.status(404).send('No blog found with this ID');
        }
        res.status(200).json({ blog });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await blogService.updateBlog(req.params.id, req.body);
        if (!blog) {
            return res.status(404).send('No blog found with this ID');
        }
        res.status(200).json({ blog });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        await blogService.deleteBlog(req.params.id);
        res.status(204).send('Blog deleted successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
};
