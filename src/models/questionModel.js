const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }
});

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Question must have a title'],
    },
    content: {
        type: String,
        required: [true, 'Question must have content'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        }
    ],
    comments: [commentSchema],
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
