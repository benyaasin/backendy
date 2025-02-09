import { Router } from 'express';
import { CommentController } from '../controllers/CommentController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes (kimlik doğrulaması gerektirmeyen)
router.get('/', CommentController.getAllComments);
router.get('/:id', CommentController.getCommentById);
router.get('/post/:postId', CommentController.getCommentsByPost);

// Protected routes (kimlik doğrulaması gerektiren)
router.post('/', authenticate, CommentController.createComment);
router.patch('/:id', authenticate, CommentController.updateComment);
router.delete('/:id', authenticate, CommentController.deleteComment);

export default router; 