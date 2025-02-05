import { Request, Response } from 'express';
import { PostModel, Post } from '../models/Post';
import { CommentModel } from '../models/Comment';

export class PostController {
  static async createPost(req: Request, res: Response): Promise<void> {
    try {
      const { category_id, title, content, published_at } = req.body;
      const newPost: Post = { 
        category_id, 
        title, 
        content, 
        published_at: published_at ? new Date(published_at) : null 
      };
      const post = await PostModel.create(newPost);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  }

  static async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await PostModel.findAll();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  static async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const post = await PostModel.findById(Number(id));
      
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      const comments = await CommentModel.findByPostId(Number(id));
      
      res.json({ ...post, comments });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  }

  static async getPostsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const posts = await PostModel.findByCategory(Number(categoryId));
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts by category' });
    }
  }

  static async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, content, published_at } = req.body;
      const updatedPost = await PostModel.update(Number(id), { 
        title, 
        content, 
        published_at: published_at ? new Date(published_at) : null 
      });
      
      if (!updatedPost) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update post' });
    }
  }

  static async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await PostModel.softDelete(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete post' });
    }
  }
} 