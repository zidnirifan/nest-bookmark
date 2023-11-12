import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateBookmarkBody, EditBookmarkBody } from './bookmark.model';
import { BookmarkService } from './bookmark.service';
import { User } from '../user/user.decorator';
import { ReqUser } from '../user/user.model';
import { AuthGuard } from '../auth/auth.guard';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @UseGuards(AuthGuard)
  @Post()
  postBookmark(@User() user: ReqUser, @Body() body: CreateBookmarkBody) {
    return this.bookmarkService.createBookmark(user.userId, body);
  }

  @UseGuards(AuthGuard)
  @Get()
  getBookmarks(@User() user: ReqUser) {
    return this.bookmarkService.getBookmarks(user.userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getBookmarkById(@User('id') userId: string, @Param('id') id: string) {
    return this.bookmarkService.getBookmarkById(userId, id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  editBookmark(
    @User('id') userId: string,
    @Param('id') id: string,
    @Body() body: EditBookmarkBody,
  ) {
    return this.bookmarkService.editBookmark(userId, id, body);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteBookmark(@User('id') userId: string, @Param('id') id: string) {
    return this.bookmarkService.deleteBookmark(userId, id);
  }
}
