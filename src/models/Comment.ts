import knex from '../db';

export interface Comment {
  id?: number;
  post_id: number;
  content: string;
  commenter_name: string;
  created_at?: Date;
}

export class CommentModel {
  static async create(comment: Comment): Promise<Comment> {
    const [newComment] = await knex('comments').insert(comment).returning('*');
    return newComment;
  }

  static async findByPostId(postId: number): Promise<Comment[]> {
    return knex('comments')
      .where({ post_id: postId })
      .orderBy('created_at', 'desc');
  }

  static async findById(id: number): Promise<Comment | undefined> {
    return knex('comments')
      .where({ id })
      .first();
  }
} 