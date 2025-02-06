import { Router } from 'express';
import { PostController } from '../controllers/PostController';

const router = Router();

router.post('/', PostController.createPost);
router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getPostById);
router.get('/category/:categoryId', PostController.getPostsByCategory);
router.patch('/:id', PostController.updatePost);
router.delete('/:id', PostController.deletePost);

export default router; 