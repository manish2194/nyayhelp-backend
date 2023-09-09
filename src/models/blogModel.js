const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog must have a title'],
    },
    description: {
        type: String,
        required: [true, 'Blog must have a title'],
    },
    image_url: {
        type: String,
        required: [true, 'Blog must have a image url'],
    },
    content: {
        type: String,
        required: [true, 'Blog must have content'],
    },
    tag: {
        type: String,
        default: "general"
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    status: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true 
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
