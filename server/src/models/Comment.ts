import prisma from '../lib/prisma';
import { Comment, Prisma } from '@prisma/client';

export interface CommentData {
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
  static async create(data: Prisma.CommentCreateInput): Promise<Comment> {
    return prisma.comment.create({ data });
  }

  static async findAll(options: CommentQueryOptions = {}): Promise<Comment[]> {
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
        post: true,
        user: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  static async findByPostId(postId: number, options: CommentQueryOptions = {}): Promise<Comment[]> {
    const { commenter } = options;
    const where: Prisma.CommentWhereInput = {
      post_id: postId
    };

    if (commenter) {
      where.commenter_name = commenter;
    }

    return prisma.comment.findMany({
      where,
      include: {
        post: true,
        user: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  static async findById(id: number): Promise<Comment | null> {
    return prisma.comment.findUnique({
      where: { id },
      include: {
        post: true,
        user: true
      }
    });
  }

  static async update(id: number, data: Prisma.CommentUpdateInput): Promise<Comment | null> {
    return prisma.comment.update({
      where: { id },
      data,
      include: {
        post: true,
        user: true
      }
    });
  }

  static async deleteComment(id: number): Promise<boolean> {
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