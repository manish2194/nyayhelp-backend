const Question = require("../models/questionModel");

// Create a new question
exports.askQuestion = async (questionData) => {
  return await Question.create(questionData);
};

// Fetch all questions
exports.getAllQuestions = async () => {
  return Question.find().populate("user").populate("comments.user");
};

// Fetch a specific question by its ID
exports.getQuestion = async (questionId) => {
  return  Question.findById(questionId)
    .populate("user")
    .populate("comments.user");
};

// Update a question based on its ID
exports.updateQuestion = async (questionId, updatedData) => {
  return  Question.findByIdAndUpdate(questionId, updatedData, {
    new: true,
  });
};

// Delete a question based on its ID
exports.deleteQuestion = async (questionId) => {
  return  Question.findByIdAndDelete(questionId);
};

// Add a comment to a specific question
exports.addComment = async (questionId, commentData) => {
  const question = await Question.findById(questionId);
  question.comments.push(commentData);
  await question.save();
  return question;
};

// Like a specific question
exports.likeQuestion = async (questionId, userId) => {
  const question = await Question.findById(questionId);
  if (!question.likes.includes(userId)) {
    question.likes.push(userId);
    await question.save();
  }
  return question;
};

// Unlike a question (optional method for removing a user's like)
exports.unlikeQuestion = async (questionId, userId) => {
  const question = await Question.findById(questionId);
  const index = question.likes.indexOf(userId);
  if (index > -1) {
    question.likes.splice(index, 1);
    await question.save();
  }
  return question;
};
