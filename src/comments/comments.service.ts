import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeworkRepository } from '../homework/homework.repository';
import { CommentRepository } from './comment.repository';
import { User } from '../auth/entities/user.entity';
import { CommentDto } from './dto/comment.dto';
import { Comment } from './entities/comment.entity';
import { NotificationService } from '../devices/notification/notification.service';
import { DeviceRepository } from '../devices/device.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(HomeworkRepository)
    private homeworkRepository: HomeworkRepository,
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
    private deviceRepository: DeviceRepository,

    private notificationService: NotificationService,
  ) {}
  async createComment(
    user: User,
    idHomework: number,
    comment: CommentDto,
  ): Promise<Comment> {
    const findHomework = await this.homeworkRepository.findOne(idHomework, {
      relations: ['user'],
    });
    const device = await this.deviceRepository.find({ user: user });

    if (!findHomework) {
      throw new InternalServerErrorException('Homework Not Found');
    }

    // rerify if the commnet is different from user comment
    /* if (findHomework.user.id !== user.id) { */
    this.notificationService.sendCommentNotification(
      user,
      device.map((device) => device.idDevice),
      comment.content,
    );
    /* } */

    return this.commentRepository.newComment(user, findHomework, comment);
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
