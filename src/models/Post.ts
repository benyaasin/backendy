import knex from '../db';

export interface Post {
  id?: number;
  category_id: number;
  title: string;
  content: string;
  created_at?: Date;
  published_at?: Date | null;
  deleted_at?: Date | null;
}

export class PostModel {
  static async create(post: Post): Promise<Post> {
    const [newPost] = await knex('posts').insert(post).returning('*');
    return newPost;
  }

  static async findAll(): Promise<Post[]> {
    return knex('posts')
      .whereNull('deleted_at')
      .join('categories', 'posts.category_id', '=', 'categories.id')
      .select('posts.*', 'categories.name as category_name');
  }

  static async findById(id: number): Promise<Post | undefined> {
    return knex('posts')
      .where({ 'posts.id': id })
      .whereNull('posts.deleted_at')
      .join('categories', 'posts.category_id', '=', 'categories.id')
      .select('posts.*', 'categories.name as category_name')
      .first();
  }

  static async findByCategory(categoryId: number): Promise<Post[]> {
    return knex('posts')
      .where({ category_id: categoryId })
      .whereNull('deleted_at');
  }

  static async update(id: number, updates: Partial<Post>): Promise<Post | undefined> {
    const [updatedPost] = await knex('posts')
      .where({ id })
      .update(updates)
      .returning('*');
    return updatedPost;
  }

  static async softDelete(id: number): Promise<void> {
    await knex('posts')
      .where({ id })
      .update({ deleted_at: new Date() });
  }
} 