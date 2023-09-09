const express = require('express');
const questionController = require('../controllers/questionController');

const router = express.Router();

router.post('/', questionController.askQuestion);
router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestion);
router.patch('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);
router.post('/:id/comments', questionController.addCommentToQuestion);
router.post('/:id/like', questionController.likeQuestion);

module.exports = router;
