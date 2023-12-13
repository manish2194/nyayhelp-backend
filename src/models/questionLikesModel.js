const mongoose = require("mongoose");

const questionLikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    question_id: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    liked: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

questionLikeSchema.index({ question_id: 1, user: 1 }, { unique: true });

const QuestionLikes = mongoose.model("QuestionLikes", questionLikeSchema);

module.exports = QuestionLikes;
