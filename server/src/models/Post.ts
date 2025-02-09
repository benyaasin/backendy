import prisma from '../lib/prisma';
import { Post, Prisma } from '@prisma/client';

export interface PostData {
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
  tags?: number[];
}

export class PostModel {
  static async create(data: Prisma.PostCreateInput): Promise<Post> {
    return prisma.post.create({ data });
  }

  static async findAll(options: PostQueryOptions = {}): Promise<Post[]> {
    const { showDeleted = 'false', status = 'all', category, tags } = options;
    
    const where: Prisma.PostWhereInput = {};

    // Handle deleted status
    switch (showDeleted) {
      case 'true':
        // Return all posts (including deleted)
        break;
      case 'onlyDeleted':
        where.deleted_at = { not: null };
        break;
      case 'false':
      default:
        where.deleted_at = null;
        break;
    }

    // Handle publication status
    switch (status) {
      case 'published':
        where.published_at = { not: null };
        break;
      case 'draft':
        where.published_at = null;
        break;
      case 'all':
      default:
        break;
    }

    // Handle category filtering
    if (category) {
      where.category_id = category;
    }

    // Handle tag filtering
    if (tags && tags.length > 0) {
      where.post_tags = {
        some: {
          tag_id: { in: tags }
        }
      };
    }

    return prisma.post.findMany({
      where,
      include: {
        category: true,
        user: true,
        comments: true,
        post_tags: {
          include: {
            tag: true
          }
        }
      }
    });
  }

  static async findById(id: number, options: PostQueryOptions = {}): Promise<Post | null> {
    const { showDeleted = 'false' } = options;
    
    const where: Prisma.PostWhereInput = { id };
    
    switch (showDeleted) {
      case 'true':
        // Return post regardless of deleted status
        break;
      case 'onlyDeleted':
        where.deleted_at = { not: null };
        break;
      case 'false':
      default:
        where.deleted_at = null;
        break;
    }

    return prisma.post.findFirst({
      where,
      include: {
        category: true,
        user: true,
        comments: true,
        post_tags: {
          include: {
            tag: true
          }
        }
      }
    });
  }

  static async findByCategory(categoryId: number, options: PostQueryOptions = {}): Promise<Post[]> {
    const { showDeleted = 'false', status = 'all' } = options;
    
    const where: Prisma.PostWhereInput = {
      category_id: categoryId
    };

    // Handle deleted status
    switch (showDeleted) {
      case 'true':
        // Return all posts (including deleted)
        break;
      case 'onlyDeleted':
        where.deleted_at = { not: null };
        break;
      case 'false':
      default:
        where.deleted_at = null;
        break;
    }

    // Handle publication status
    switch (status) {
      case 'published':
        where.published_at = { not: null };
        break;
      case 'draft':
        where.published_at = null;
        break;
      case 'all':
      default:
        break;
    }

    return prisma.post.findMany({
      where,
      include: {
        category: true,
        user: true,
        comments: true,
        post_tags: {
          include: {
            tag: true
          }
        }
      }
    });
  }

  static async update(id: number, data: Prisma.PostUpdateInput): Promise<Post | null> {
    return prisma.post.update({
      where: { id },
      data,
      include: {
        category: true,
        user: true,
        comments: true,
        post_tags: {
          include: {
            tag: true
          }
        }
      }
    });
  }

  static async softDelete(id: number): Promise<boolean> {
    try {
      await prisma.post.update({
        where: { id },
        data: { deleted_at: new Date() }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
} 