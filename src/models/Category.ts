import knex from '../db';

export interface Category {
  id?: number;
  name: string;
  created_at?: Date;
  deleted_at?: Date | null;
}

export class CategoryModel {
  static async create(category: Category): Promise<Category> {
    const [newCategory] = await knex('categories').insert(category).returning('*');
    return newCategory;
  }

  static async findAll(): Promise<Category[]> {
    return knex('categories').whereNull('deleted_at');
  }

  static async findById(id: number): Promise<Category | undefined> {
    return knex('categories').where({ id }).whereNull('deleted_at').first();
  }

  static async update(id: number, updates: Partial<Category>): Promise<Category | undefined> {
    const [updatedCategory] = await knex('categories')
      .where({ id })
      .update(updates)
      .returning('*');
    return updatedCategory;
  }

  static async softDelete(id: number): Promise<void> {
    await knex('categories')
      .where({ id })
      .update({ deleted_at: new Date() });
  }
} 