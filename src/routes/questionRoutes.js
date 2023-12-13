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

router.post("/question", checkAuthentication(), askQuestion);
router.get("/question", getAllQuestions);
router.get("/question/:id", getQuestion);
// router.patch('/:id', questionController.updateQuestion);
router.get("/question/:id/comments", getAllComments);
router.post(
  "/question/:id/comments",
  checkAuthentication(),
  addCommentToQuestion
);
// router.post('/question/:id/like', questionController.likeQuestion);

module.exports = router;
