import { Request, Response } from 'express';
import { TagService } from '../services/TagService';

const tagService = new TagService();

export class TagController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const tag = await tagService.create({ name });
      res.status(201).json(tag);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create tag' });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const tags = await tagService.findAll();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tags' });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tag = await tagService.findById(Number(id));
      
      if (!tag) {
        res.status(404).json({ error: 'Tag not found' });
        return;
      }
      
      res.json(tag);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tag' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const tag = await tagService.update(Number(id), { name });
      
      if (!tag) {
        res.status(404).json({ error: 'Tag not found' });
        return;
      }
      
      res.json(tag);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update tag' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await tagService.delete(Number(id));
      
      if (!deleted) {
        res.status(404).json({ error: 'Tag not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete tag' });
    }
  }
} 