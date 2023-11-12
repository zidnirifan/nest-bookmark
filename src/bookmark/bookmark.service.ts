import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkBody, EditBookmarkBody } from './bookmark.model';
import { Bookmark } from '@prisma/client';
import { Res } from 'src/common/interface';

@Injectable()
export class BookmarkService {
  constructor(private prismaService: PrismaService) {}

  async createBookmark(
    userId: string,
    payload: CreateBookmarkBody,
  ): Promise<Res<Bookmark>> {
    const result = await this.prismaService.bookmark.create({
      data: { ...payload, userId },
    });
    return { ok: true, message: 'create bookmark success', data: result };
  }

  async getBookmarks(userId: string): Promise<Res<Bookmark[]>> {
    const result = await this.prismaService.bookmark.findMany({
      where: { userId },
    });
    return { ok: true, message: 'success get bookmarks', data: result };
  }

  async getBookmarkById(userId: string, id: string): Promise<Res<Bookmark>> {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: { userId, id },
    });
    if (!bookmark) throw new NotFoundException('bookmark not found');

    return { ok: true, message: 'success get bookmark', data: bookmark };
  }

  async editBookmark(
    userId: string,
    id: string,
    data: EditBookmarkBody,
  ): Promise<Res<Bookmark>> {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: { userId, id },
    });
    if (!bookmark) throw new NotFoundException('bookmark not found');

    const result = await this.prismaService.bookmark.update({
      where: { id },
      data,
    });

    return { ok: true, message: 'success update bookmark', data: result };
  }

  async deleteBookmark(userId: string, id: string): Promise<Res<Bookmark>> {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: { userId, id },
    });
    if (!bookmark) throw new NotFoundException('bookmark not found');

    const result = await this.prismaService.bookmark.delete({ where: { id } });
    return { ok: true, message: 'success delete bookmark', data: result };
  }
}
