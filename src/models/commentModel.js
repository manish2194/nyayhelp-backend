const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    question_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Question",
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
commentSchema.index({ question_id: 1 });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
