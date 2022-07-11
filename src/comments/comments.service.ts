import {
  Injectable,
  InternalServerErrorException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { CommentDto } from './dto/comment.dto';
import { Comment } from './entities/comment.entity';
import { NotificationService } from '../devices/notification/notification.service';
import { Repository } from 'typeorm';
import { HomeworkService } from '../homework/homework.service';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(forwardRef(() => HomeworkService))
    private homeworkService: HomeworkService,

    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private notificationService: NotificationService,
  ) {}
  async createComment(
    user: User,
    idHomework: number,
    comment: CommentDto,
  ): Promise<Comment> {
    const getHomework = await this.homeworkService.getOneHomeworkUser(
      idHomework,
    );

    if (!getHomework) {
      throw new InternalServerErrorException('Homework Not Found');
    }

    // rerify if the commnet is different from user comment
    if (getHomework.user.id !== user.id) {
      this.notificationService.sendCommentNotification(
        user,
        comment.content,
        getHomework,
      );
    }

    try {
      return await this.commentRepository.save({
        user,
        getHomework,
        ...comment,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async getCommentsByHomework(homeworkId: number) {
    try {
      return await this.commentRepository
        .createQueryBuilder('comment')
        .where({ homework: homeworkId })
        .select([
          'comment.id',
          'comment.content',
          'comment.edited',
          'comment.created_at',
          /* 'foo.createdAt', */
          'user.id',
          'user.username',
          'user.profileImageUrl',
        ])
        .leftJoin('comment.user', 'user') // bar is the joined table
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async deleteComment(user: User, commentId: number): Promise<void> {
    const findComment = await this.commentRepository.findOne(commentId);

    if (!findComment) {
      throw new InternalServerErrorException('Comment not Found');
    }
    try {
      if (findComment.user.id !== user.id) {
        throw new InternalServerErrorException('You are not the owner');
      }
      await this.commentRepository.delete(findComment.id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  async editComment(
    user: User,
    idComment: number,
    comment: CommentDto,
  ): Promise<CommentDto> {
    /* return this.commentRepository.editComment(user, idComment, comment); */
    try {
      const getComment = await this.commentRepository.findOne(idComment);
      if (!getComment) {
        throw new InternalServerErrorException("comment doesn't exist");
      }
      if (getComment.user.id !== user.id) {
        throw new InternalServerErrorException('You are not the owner');
      }
      const commentEdit = await this.commentRepository.save({
        ...getComment,
        ...comment,
        edited: true,
      });
      return commentEdit;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
