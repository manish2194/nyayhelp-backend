const express = require("express");
const {
  askQuestion,
  getAllQuestions,
  getQuestion,
  addCommentToQuestion,
  getAllComments,
} = require("../controllers/questionController");
const { checkAuthentication } = require("../middleware/requireAuth");
const router = express.Router();

router.post("/", checkAuthentication(), askQuestion);
router.get("/", getAllQuestions);
router.get("/:id", getQuestion);
// router.patch('/:id', questionController.updateQuestion);
router.get("/:id/comments", getAllComments);
router.post("/:id/comments", checkAuthentication(), addCommentToQuestion);
// router.post('/:id/like', questionController.likeQuestion);

module.exports = router;
