import { Request, Response } from 'express';
import { CategoryModel, Category } from '../models/Category';

export class CategoryController {
  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const newCategory: Category = { name };
      const category = await CategoryModel.create(newCategory);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create category' });
    }
  }

  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryModel.findAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updatedCategory = await CategoryModel.update(Number(id), { name });
      
      if (!updatedCategory) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update category' });
    }
  }

  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await CategoryModel.softDelete(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  }
} 