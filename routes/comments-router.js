const commentsRouter = require('express').Router();

const { deleteComment, patchComment } = require('../controllers/controllers');

commentsRouter.route('/:comment_id').patch(patchComment);

commentsRouter.route('/:comment_id').delete(deleteComment);

module.exports = commentsRouter;
