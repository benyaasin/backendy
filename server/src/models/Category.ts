import prisma from '../lib/prisma';
import { Category, Prisma } from '@prisma/client';

export interface CategoryQueryOptions {
  showDeleted?: 'true' | 'false' | 'onlyDeleted';
}

export class CategoryModel {
  static async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data });
  }

  static async findAll(options: CategoryQueryOptions = {}): Promise<Category[]> {
    const { showDeleted = 'false' } = options;
    
    const where: Prisma.CategoryWhereInput = {};

    switch (showDeleted) {
      case 'true':
        // Return all categories (including deleted)
        break;
      case 'onlyDeleted':
        where.deleted_at = { not: null };
        break;
      case 'false':
      default:
        where.deleted_at = null;
        break;
    }

    return prisma.category.findMany({
      where,
      include: {
        posts: true
      }
    });
  }

  static async findById(id: number, options: CategoryQueryOptions = {}): Promise<Category | null> {
    const { showDeleted = 'false' } = options;
    
    const where: Prisma.CategoryWhereInput = { id };
    
    switch (showDeleted) {
      case 'true':
        // Return category regardless of deleted status
        break;
      case 'onlyDeleted':
        where.deleted_at = { not: null };
        break;
      case 'false':
      default:
        where.deleted_at = null;
        break;
    }

    return prisma.category.findFirst({
      where,
      include: {
        posts: true
      }
    });
  }

  static async update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category | null> {
    return prisma.category.update({
      where: { id },
      data,
      include: {
        posts: true
      }
    });
  }

  static async softDelete(id: number): Promise<boolean> {
    try {
      await prisma.category.update({
        where: { id },
        data: { deleted_at: new Date() }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
} 