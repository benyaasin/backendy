import { Request, Response } from 'express';
import { PostService } from '../services/PostService';

const postService = new PostService();

export class PostController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { category_id, title, content, published_at } = req.body;
      const post = await postService.create({
        category: { connect: { id: category_id } },
        title,
        content,
        published_at: published_at ? new Date(published_at) : null
      });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Gönderi oluşturulamadı' });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const { showDeleted, status, category, tags } = req.query;
      const posts = await postService.findAll({
        showDeleted: showDeleted as 'true' | 'false' | 'onlyDeleted',
        status: status as 'published' | 'draft' | 'all',
        category: category ? Number(category) : undefined,
        tags: tags ? (tags as string).split(',').map(Number) : undefined
      });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Gönderiler getirilemedi' });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { showDeleted } = req.query;
      const post = await postService.findById(
        Number(id),
        showDeleted as 'true' | 'false' | 'onlyDeleted'
      );
      
      if (!post) {
        res.status(404).json({ error: 'Gönderi bulunamadı' });
        return;
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Gönderi getirilemedi' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, content, published_at } = req.body;
      const post = await postService.update(Number(id), {
        title,
        content,
        published_at: published_at ? new Date(published_at) : null
      });
      
      if (!post) {
        res.status(404).json({ error: 'Gönderi bulunamadı' });
        return;
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Gönderi güncellenemedi' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await postService.softDelete(Number(id));
      
      if (!deleted) {
        res.status(404).json({ error: 'Gönderi bulunamadı' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Gönderi silinemedi' });
    }
  }

  async addTag(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { tagId } = req.body;
      const success = await postService.addTag(Number(id), Number(tagId));
      
      if (!success) {
        res.status(404).json({ error: 'Gönderi veya etiket bulunamadı' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Etiket eklenemedi' });
    }
  }

  async removeTag(req: Request, res: Response): Promise<void> {
    try {
      const { id, tagId } = req.params;
      const success = await postService.removeTag(Number(id), Number(tagId));
      
      if (!success) {
        res.status(404).json({ error: 'Gönderi veya etiket bulunamadı' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Etiket kaldırılamadı' });
    }
  }
} 