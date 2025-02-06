import { Router } from 'express';
import { CommentController } from '../controllers/CommentController';

const router = Router();

router.post('/', CommentController.createComment);
router.get('/', CommentController.getAllComments);
router.get('/:id', CommentController.getCommentById);
router.get('/post/:postId', CommentController.getCommentsByPost);
router.patch('/:id', CommentController.updateComment);
router.delete('/:id', CommentController.deleteComment);

export default router; 