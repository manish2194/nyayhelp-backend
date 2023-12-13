const Question = require("../models/questionModel");
const questionService = require("../services/questionService");

exports.askQuestion = async (req, res) => {
  try {
    const question = await questionService.askQuestion(req.user._id, req.body);
    res.status(201).json({ question });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const question = await questionService.getAllQuestions();
    res.status(201).json({ question });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const question = await questionService.getQuestion(req.params.id);
    if (!question) {
      return res.status(404).send("No Question found with this ID");
    }
    res.status(200).json({ question });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// ... similar methods for other routes like getAllQuestions, getQuestion, etc.

exports.addCommentToQuestion = async (req, res) => {
  try {
    const question = await questionService.addComment(
      req.params.id,
      req.user,
      req.body
    );
    res.json({ question });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await questionService.getAllComments(req.params.id);
    res.json({ comments });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.likeQuestion = async (req, res) => {
  try {
    const question = await questionService.likeQuestion(
      req.params.id,
      req.user.id
    );
    res.status(200).json({ question });
  } catch (err) {
    res.status(400).send(err.message);
  }
};
