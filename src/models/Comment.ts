import knex from '../db';

export interface Comment {
  id?: number;
  post_id: number;
  content: string;
  commenter_name: string;
  created_at?: Date;
}

export interface CommentQueryOptions {
  post?: number;
  commenter?: string;
}

export class CommentModel {
  static async create(comment: Comment): Promise<Comment> {
    const [newComment] = await knex('comments').insert(comment).returning('*');
    return newComment;
  }

  static async findAll(options: CommentQueryOptions = {}): Promise<Comment[]> {
    const { post, commenter } = options;
    
    let query = knex('comments');

    // Handle post filtering
    if (post) {
      query = query.where({ post_id: post });
    }

    // Handle commenter filtering
    if (commenter) {
      query = query.where({ commenter_name: commenter });
    }

    return query.orderBy('created_at', 'desc');
  }

  static async findByPostId(postId: number, options: CommentQueryOptions = {}): Promise<Comment[]> {
    const { commenter } = options;
    
    let query = knex('comments').where({ post_id: postId });

    // Handle commenter filtering
    if (commenter) {
      query = query.where({ commenter_name: commenter });
    }

    return query.orderBy('created_at', 'desc');
  }

  static async findById(id: number): Promise<Comment | undefined> {
    return knex('comments')
      .where({ id })
      .first();
  }

  static async update(id: number, updates: Partial<Comment>): Promise<Comment | undefined> {
    // First, check if the comment exists
    const existingComment = await this.findById(id);
    
    if (!existingComment) {
      return undefined;
    }

    const [updatedComment] = await knex('comments')
      .where({ id })
      .update(updates)
      .returning('*');
    return updatedComment;
  }

  static async deleteComment(id: number): Promise<boolean> {
    // First, check if the comment exists
    const existingComment = await this.findById(id);
    
    if (!existingComment) {
      return false;
    }

    await knex('comments')
      .where({ id })
      .del();
    
    return true;
  }
} 