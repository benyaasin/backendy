import prisma from '../lib/prisma';
import { Post, Prisma } from '@prisma/client';

interface PostQueryOptions {
  showDeleted?: 'true' | 'false' | 'onlyDeleted';
  status?: 'published' | 'draft' | 'all';
  category?: number;
  tags?: number[];
}

export class PostService {
  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return prisma.post.create({ data });
  }

  async findAll(options: PostQueryOptions = {}): Promise<Post[]> {
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
        post_tags: {
          include: {
            tag: true
          }
        }
      }
    });
  }

  async findById(id: number, showDeleted?: 'true' | 'false' | 'onlyDeleted'): Promise<Post | null> {
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
        comments: true,
        post_tags: {
          include: {
            tag: true
          }
        }
      }
    });
  }

  async update(id: number, data: Prisma.PostUpdateInput): Promise<Post | null> {
    const post = await this.findById(id);
    if (!post || post.deleted_at) return null;

    return prisma.post.update({
      where: { id },
      data,
      include: {
        category: true,
        post_tags: {
          include: {
            tag: true
          }
        }
      }
    });
  }

  async softDelete(id: number): Promise<boolean> {
    const post = await this.findById(id);
    if (!post || post.deleted_at) return false;

    await prisma.post.update({
      where: { id },
      data: { deleted_at: new Date() }
    });

    return true;
  }

  async addTag(postId: number, tagId: number): Promise<boolean> {
    try {
      await prisma.postTag.create({
        data: {
          post_id: postId,
          tag_id: tagId
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async removeTag(postId: number, tagId: number): Promise<boolean> {
    try {
      await prisma.postTag.delete({
        where: {
          post_id_tag_id: {
            post_id: postId,
            tag_id: tagId
          }
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
} 