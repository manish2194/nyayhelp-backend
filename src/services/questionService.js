const Question = require("../models/questionModel");
const Comment = require("../models/commentModel");
const { options } = require("../routes/questionRoutes");

// Create a new question
exports.askQuestion = async (user_id, questionData) => {
  questionData.user = user_id;
  return await Question.create(questionData);
};

// Fetch all questions
exports.getAllQuestions = async (skipCount, page_size) => {
  // return Question.find().populate("user", (select = ["user_name"]));
  const [questions, totalItems] = await Promise.allSettled([
    Question.find()
      .skip(skipCount)
      .limit(page_size)
      .populate("user", (select = ["user_name"])),
    Question.countDocuments(),
  ]);
  return { questions: questions.value, total_count: totalItems.value };
};

// Fetch a specific question by its ID
exports.getQuestion = async (questionId) => {
  return Question.findById(questionId).populate(
    "user",
    (select = ["user_name"])
  );
};

// Update a question based on its ID
exports.updateQuestion = async (questionId, updatedData) => {
  return Question.findByIdAndUpdate(questionId, updatedData, {
    new: true,
  });
};

// Delete a question based on its ID
exports.deleteQuestion = async (questionId) => {
  return Question.findByIdAndDelete(questionId);
};

// Add a comment to a specific question
exports.addComment = async (questionId, user, commentData) => {
  const question = await Question.findById(questionId);
  if (!question) throw new Error("Question does not exist");
  commentData.question_id = questionId;
  commentData.user = user._id;
  await Comment.create(commentData);
  await Question.updateOne(
    { _id: questionId },
    { $inc: { total_comments: 1 } }
  );
};

// Add a comment to a specific question
exports.getAllComments = async (questionId) => {
  const question = await Question.findById(questionId);
  if (!question) throw new Error("Question does not exist");
  return await Comment.find({ question_id: questionId }).populate(
    "user",
    (select = ["user_name"])
  );
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
