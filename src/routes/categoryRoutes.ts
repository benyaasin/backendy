import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';

const router = Router();
const categoryController = new CategoryController();

router.post('/', categoryController.create);
router.get('/', categoryController.findAll);
router.get('/:id', categoryController.findById);
router.patch('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);

export default router; 