import { Request, Response } from 'express';
import { CategoryModel, Category, CategoryQueryOptions } from '../models/Category';
import { Category } from '../types/Category';

export class CategoryController {
  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const newCategory: Category = { name };
      const category = await CategoryModel.create(newCategory);
      res.status(201).json(category);
    } catch (error) {
      console.error('Kategori oluşturma hatası:', error);
      res.status(500).json({ 
        message: 'Kategori oluşturulamadı',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  }

  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const { showDeleted } = req.query;
      const options: CategoryQueryOptions = {
        showDeleted: showDeleted as 'true' | 'false' | 'onlyDeleted' || 'false'
      };
      const categories = await CategoryModel.findAll(options);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { showDeleted } = req.query;
      const options: CategoryQueryOptions = {
        showDeleted: showDeleted as 'true' | 'false' | 'onlyDeleted' || 'false'
      };
      const category = await CategoryModel.findById(Number(id), options);
      
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch category' });
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
      const deleted = await CategoryModel.softDelete(Number(id));
      
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