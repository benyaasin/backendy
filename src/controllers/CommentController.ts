import { Request, Response } from 'express';
import { CommentModel, Comment } from '../models/Comment';
import { PostModel } from '../models/Post';

export class CommentController {
  static async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { post_id, content, commenter_name } = req.body;
      
      // Validate that the post exists
      const post = await PostModel.findById(post_id);
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      const newComment: Comment = { 
        post_id, 
        content, 
        commenter_name 
      };
      const comment = await CommentModel.create(newComment);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create comment' });
    }
  }

  static async getCommentsByPost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const comments = await CommentModel.findByPostId(Number(postId));
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }
} 