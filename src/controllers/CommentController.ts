import { Request, Response } from 'express';
import { CommentModel, Comment, CommentQueryOptions } from '../models/Comment';
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

  static async getAllComments(req: Request, res: Response): Promise<void> {
    try {
      const { post, commenter } = req.query;
      const options: CommentQueryOptions = {
        post: post ? Number(post) : undefined,
        commenter: commenter as string
      };
      const comments = await CommentModel.findAll(options);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }

  static async getCommentsByPost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const { commenter } = req.query;
      const options: CommentQueryOptions = {
        commenter: commenter as string
      };
      const comments = await CommentModel.findByPostId(Number(postId), options);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }

  static async getCommentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const comment = await CommentModel.findById(Number(id));
      
      if (!comment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }
      
      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comment' });
    }
  }

  static async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const updatedComment = await CommentModel.update(Number(id), { content });
      
      if (!updatedComment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }
      
      res.json(updatedComment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update comment' });
    }
  }

  static async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await CommentModel.deleteComment(Number(id));
      
      if (!deleted) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  }
} 