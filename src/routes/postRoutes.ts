import { Router } from 'express';
import { PostController } from '../controllers/PostController';
import { authenticate } from '../middleware/auth';

const router = Router();
const postController = new PostController();

// Public routes (kimlik doğrulaması gerektirmeyen)
router.get('/', postController.findAll);
router.get('/:id', postController.findById);

// Protected routes (kimlik doğrulaması gerektiren)
router.post('/', authenticate, postController.create);
router.patch('/:id', authenticate, postController.update);
router.delete('/:id', authenticate, postController.delete);

// Tag routes
router.post('/:id/tags', authenticate, postController.addTag);
router.delete('/:id/tags/:tagId', authenticate, postController.removeTag);

export default router; 