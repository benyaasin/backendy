import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';

const router = Router();

router.post('/', CategoryController.createCategory);
router.get('/', CategoryController.getAllCategories);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

export default router; 