import { Router } from 'express';
import { CommentController } from '../controllers/CommentController';

const router = Router();

router.post('/', CommentController.createComment);
router.get('/post/:postId', CommentController.getCommentsByPost);

export default router; 