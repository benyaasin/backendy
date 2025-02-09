import prisma from '../lib/prisma';
import { Category, Prisma } from '@prisma/client';

export class CategoryService {
  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data });
  }

  async findAll(showDeleted?: 'true' | 'false' | 'onlyDeleted'): Promise<Category[]> {
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

    return prisma.category.findMany({ where });
  }

  async findById(id: number, showDeleted?: 'true' | 'false' | 'onlyDeleted'): Promise<Category | null> {
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

    return prisma.category.findFirst({ where });
  }

  async update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category | null> {
    const category = await this.findById(id);
    if (!category || category.deleted_at) return null;

    return prisma.category.update({
      where: { id },
      data
    });
  }

  async softDelete(id: number): Promise<boolean> {
    const category = await this.findById(id);
    if (!category || category.deleted_at) return false;

    await prisma.category.update({
      where: { id },
      data: { deleted_at: new Date() }
    });

    return true;
  }
} 