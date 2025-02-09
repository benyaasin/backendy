import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';

const categoryService = new CategoryService();

export class CategoryController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const category = await categoryService.create({ name });
      res.status(201).json(category);
    } catch (error) {
      console.error('Category creation error:', error);
      res.status(500).json({ 
        message: 'Failed to create category',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const { showDeleted } = req.query;
      const categories = await categoryService.findAll(
        showDeleted as 'true' | 'false' | 'onlyDeleted'
      );
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { showDeleted } = req.query;
      const category = await categoryService.findById(
        Number(id),
        showDeleted as 'true' | 'false' | 'onlyDeleted'
      );
      
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const category = await categoryService.update(Number(id), { name });
      
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update category' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await categoryService.softDelete(Number(id));
      
      if (!deleted) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  }
} 