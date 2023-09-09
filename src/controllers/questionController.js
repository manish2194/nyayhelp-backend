const Question = require('../models/questionModel');
const questionService = require('../services/questionService');

exports.askQuestion = async (req, res) => {
    try {
        const question = await questionService.askQuestion(req.body);
        res.status(201).json({ question });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// ... similar methods for other routes like getAllQuestions, getQuestion, etc.

exports.addCommentToQuestion = async (req, res) => {
    try {
        const question = await questionService.addComment(req.params.id, req.body);
        res.status(200).json({ question });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.likeQuestion = async (req, res) => {
    try {
        const question = await questionService.likeQuestion(req.params.id, req.user.id);
        res.status(200).json({ question });
    } catch (err) {
        res.status(400).send(err.message);
    }
};
