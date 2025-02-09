import { Router } from 'express';
import { PostController } from '../controllers/PostController';

const router = Router();
const postController = new PostController();

router.post('/', postController.create);
router.get('/', postController.findAll);
router.get('/:id', postController.findById);
router.patch('/:id', postController.update);
router.delete('/:id', postController.delete);

// Tag routes
router.post('/:id/tags', postController.addTag);
router.delete('/:id/tags/:tagId', postController.removeTag);

export default router; 