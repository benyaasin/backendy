import prisma from '../lib/prisma';
import { Tag, Prisma } from '@prisma/client';

export class TagService {
  async create(data: Prisma.TagCreateInput): Promise<Tag> {
    return prisma.tag.create({ data });
  }

  async findAll(): Promise<Tag[]> {
    return prisma.tag.findMany({
      include: {
        post_tags: true
      }
    });
  }

  async findById(id: number): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { id },
      include: {
        post_tags: {
          include: {
            post: true
          }
        }
      }
    });
  }

  async update(id: number, data: Prisma.TagUpdateInput): Promise<Tag | null> {
    const tag = await this.findById(id);
    if (!tag) return null;

    return prisma.tag.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.tag.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
} 