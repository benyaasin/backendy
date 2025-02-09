import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authorize } from '../middleware/auth';

const router = Router();
const categoryController = new CategoryController();

router.post('/', authorize('admin', 'moderator'), categoryController.create);
router.get('/', categoryController.findAll);
router.get('/:id', categoryController.findById);
router.patch('/:id', authorize('admin', 'moderator'), categoryController.update);
router.delete('/:id', authorize('admin'), categoryController.delete);

export default router; 