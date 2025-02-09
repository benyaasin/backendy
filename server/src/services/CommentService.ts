import prisma from '../lib/prisma';
import { Comment, Prisma } from '@prisma/client';

interface CommentQueryOptions {
  post?: number;
  commenter?: string;
}

export class CommentService {
  async create(data: Prisma.CommentCreateInput): Promise<Comment> {
    return prisma.comment.create({ data });
  }

  async findAll(options: CommentQueryOptions = {}): Promise<Comment[]> {
    const { post, commenter } = options;
    const where: Prisma.CommentWhereInput = {};

    if (post) {
      where.post_id = post;
    }

    if (commenter) {
      where.commenter_name = commenter;
    }

    return prisma.comment.findMany({
      where,
      include: {
        post: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  async findById(id: number): Promise<Comment | null> {
    return prisma.comment.findUnique({
      where: { id },
      include: {
        post: true
      }
    });
  }

  async findByPostId(postId: number, commenter?: string): Promise<Comment[]> {
    const where: Prisma.CommentWhereInput = {
      post_id: postId
    };

    if (commenter) {
      where.commenter_name = commenter;
    }

    return prisma.comment.findMany({
      where,
      include: {
        post: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  async update(id: number, data: Prisma.CommentUpdateInput): Promise<Comment | null> {
    const comment = await this.findById(id);
    if (!comment) return null;

    return prisma.comment.update({
      where: { id },
      data,
      include: {
        post: true
      }
    });
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.comment.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
} 