import { Controller, Post, Body, Param, UseGuards, Get, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { GetUser } from '../auth/get-user..decorator';
import { User } from '../auth/entities/User';
import { CommentDto } from './dto/comment.dto';
import { Comment } from './entities/comment.entity';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('comments')
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @Post('/newComment/:idHomework')
  newComment(
    @GetUser() user: User,
    @Param('idHomework') idHomework: number,
    @Body() comment: CommentDto,
  ): Promise<Comment> {
    return this.commentService.createComment(user, idHomework, comment);
  }
  @Get('/getcomments/:homeworkId')
  getCommentsByHomework(
    @Param('homeworkId') homeworkId: number,
  ): Promise<Comment[]> {
    return this.commentService.getCommentsByHomework(homeworkId);
  }

  @Delete('/deletecomment/:id')
  deleteHomeWork(
    @GetUser() user: User,
    @Param('id') id: number,
  ): Promise<void> {
    return this.commentService.deleteComment(user, id);
  }
}
