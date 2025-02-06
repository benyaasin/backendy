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

export interface PostQueryOptions {
  showDeleted?: 'true' | 'false' | 'onlyDeleted';
  status?: 'published' | 'draft' | 'all';
  category?: number;
}

export class PostModel {
  static async create(post: Post): Promise<Post> {
    const [newPost] = await knex('posts').insert(post).returning('*');
    return newPost;
  }

  static async findAll(options: PostQueryOptions = {}): Promise<Post[]> {
    const { 
      showDeleted = 'false', 
      status = 'all', 
      category 
    } = options;
    
    let query = knex('posts')
      .join('categories', 'posts.category_id', '=', 'categories.id')
      .select('posts.*', 'categories.name as category_name');

    // Handle deleted status
    switch (showDeleted) {
      case 'true':
        // Return all posts (including deleted)
        break;
      case 'onlyDeleted':
        // Return only deleted posts
        query = query.whereNotNull('posts.deleted_at');
        break;
      case 'false':
      default:
        // Return only non-deleted posts
        query = query.whereNull('posts.deleted_at');
        break;
    }

    // Handle publication status
    switch (status) {
      case 'published':
        query = query.whereNotNull('published_at');
        break;
      case 'draft':
        query = query.whereNull('published_at');
        break;
      case 'all':
      default:
        break;
    }

    // Handle category filtering
    if (category) {
      query = query.where('posts.category_id', category);
    }

    return query;
  }

  static async findById(id: number, options: PostQueryOptions = {}): Promise<Post | undefined> {
    const { showDeleted = 'false' } = options;
    
    let query = knex('posts')
      .where({ 'posts.id': id })
      .join('categories', 'posts.category_id', '=', 'categories.id')
      .select('posts.*', 'categories.name as category_name');

    switch (showDeleted) {
      case 'true':
        // Return post regardless of deleted status
        break;
      case 'onlyDeleted':
        // Return only if deleted
        query = query.whereNotNull('posts.deleted_at');
        break;
      case 'false':
      default:
        // Return only if not deleted
        query = query.whereNull('posts.deleted_at');
        break;
    }

    return query.first();
  }

  static async findByCategory(categoryId: number, options: PostQueryOptions = {}): Promise<Post[]> {
    const { showDeleted = 'false', status = 'all' } = options;
    
    let query = knex('posts')
      .where({ category_id: categoryId })
      .join('categories', 'posts.category_id', '=', 'categories.id')
      .select('posts.*', 'categories.name as category_name');

    // Handle deleted status
    switch (showDeleted) {
      case 'true':
        // Return all posts (including deleted)
        break;
      case 'onlyDeleted':
        // Return only deleted posts
        query = query.whereNotNull('posts.deleted_at');
        break;
      case 'false':
      default:
        // Return only non-deleted posts
        query = query.whereNull('posts.deleted_at');
        break;
    }

    // Handle publication status
    switch (status) {
      case 'published':
        query = query.whereNotNull('published_at');
        break;
      case 'draft':
        query = query.whereNull('published_at');
        break;
      case 'all':
      default:
        break;
    }

    return query;
  }

  static async update(id: number, updates: Partial<Post>): Promise<Post | undefined> {
    // First, check if the post exists and is not deleted
    const existingPost = await this.findById(id);
    
    if (!existingPost) {
      return undefined;
    }

    const [updatedPost] = await knex('posts')
      .where({ id })
      .update(updates)
      .returning('*');
    return updatedPost;
  }

  static async softDelete(id: number): Promise<boolean> {
    // First, check if the post exists and is not already deleted
    const existingPost = await this.findById(id);
    
    if (!existingPost) {
      return false;
    }

    await knex('posts')
      .where({ id })
      .update({ deleted_at: new Date() });
    
    return true;
  }
} 