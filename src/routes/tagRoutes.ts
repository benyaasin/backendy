import { Router } from 'express';
import { TagController } from '../controllers/TagController';

const router = Router();
const tagController = new TagController();

router.post('/', tagController.create);
router.get('/', tagController.findAll);
router.get('/:id', tagController.findById);
router.patch('/:id', tagController.update);
router.delete('/:id', tagController.delete);

export default router; 