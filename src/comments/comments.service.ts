import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeworkRepository } from '../homework/homework.repository';
import { CommentRepository } from './comment.repository';
import { User } from '../auth/entities/user.entity';
import { CommentDto } from './dto/comment.dto';
import { Comment } from './entities/comment.entity';
import { NotificationService } from '../devices/notification/notification.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(HomeworkRepository)
    private homeworkRepository: HomeworkRepository,
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
    private notificationService: NotificationService,
  ) {}
  async createComment(
    user: User,
    idHomework: number,
    comment: CommentDto,
  ): Promise<Comment> {
    const getHomework = await this.homeworkRepository.findOne(idHomework, {
      relations: ['user'],
    });

    if (!getHomework) {
      throw new InternalServerErrorException('Homework Not Found');
    }

    // rerify if the commnet is different from user comment
    /* if (findHomework.user.id !== user.id) { */
    this.notificationService.sendCommentNotification(
      user,
      comment.content,
      getHomework,
    );
    /* } */
    

    return this.commentRepository.newComment(user, getHomework, comment);
  }
  async getCommentsByHomework(homeworkId: number): Promise<Comment[]> {
    return this.commentRepository.getCommentsByHomework(homeworkId);
  }
  async deleteComment(user: User, commentId: number): Promise<void> {
    const findComment = await this.commentRepository.findOne(commentId);

    if (!findComment) {
      throw new InternalServerErrorException('Homework Not Found');
    }
    return this.commentRepository.deleteComment(user, findComment);
  }
  async editComment(
    user: User,
    idComment: number,
    comment: CommentDto,
  ): Promise<CommentDto> {
    return this.commentRepository.editComment(user, idComment, comment);
  }
}
