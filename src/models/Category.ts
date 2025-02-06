import knex from '../db';

export interface Category {
  id?: number;
  name: string;
  created_at?: Date;
  deleted_at?: Date | null;
}

export interface CategoryQueryOptions {
  showDeleted?: 'true' | 'false' | 'onlyDeleted';
}

export class CategoryModel {
  static async create(category: Category): Promise<Category> {
    const [newCategory] = await knex('categories').insert(category).returning('*');
    return newCategory;
  }

  static async findAll(options: CategoryQueryOptions = {}): Promise<Category[]> {
    const { showDeleted = 'false' } = options;
    
    let query = knex('categories');

    switch (showDeleted) {
      case 'true':
        // Return all categories (including deleted)
        break;
      case 'onlyDeleted':
        // Return only deleted categories
        query = query.whereNotNull('deleted_at');
        break;
      case 'false':
      default:
        // Return only non-deleted categories
        query = query.whereNull('deleted_at');
        break;
    }

    return query;
  }

  static async findById(id: number, options: CategoryQueryOptions = {}): Promise<Category | undefined> {
    const { showDeleted = 'false' } = options;
    
    let query = knex('categories').where({ id });

    switch (showDeleted) {
      case 'true':
        // Return category regardless of deleted status
        break;
      case 'onlyDeleted':
        // Return only if deleted
        query = query.whereNotNull('deleted_at');
        break;
      case 'false':
      default:
        // Return only if not deleted
        query = query.whereNull('deleted_at');
        break;
    }

    return query.first();
  }

  static async update(id: number, updates: Partial<Category>): Promise<Category | undefined> {
    // First, check if the category exists and is not deleted
    const existingCategory = await this.findById(id);
    
    if (!existingCategory) {
      return undefined;
    }

    const [updatedCategory] = await knex('categories')
      .where({ id })
      .update(updates)
      .returning('*');
    return updatedCategory;
  }

  static async softDelete(id: number): Promise<boolean> {
    // First, check if the category exists and is not already deleted
    const existingCategory = await this.findById(id);
    
    if (!existingCategory) {
      return false;
    }

    await knex('categories')
      .where({ id })
      .update({ deleted_at: new Date() });
    
    return true;
  }
} 