import { EntityRepository, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { CommentDto } from './dto/comment.dto';
import { User } from '../auth/entities/User';
import { Homework } from 'src/homework/entities/Homework';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async newComment(
    user: User,
    homework: Homework,
    comment: CommentDto,
  ): Promise<Comment> {
    try {
      return await this.save({ user, homework, ...comment });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async getCommentsByHomework(homeworkId: number): Promise<Comment[]> {
    try {
      const comments = await this.find({ where: { homework: homeworkId } });
      console.log(comments);
      return comments;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async deleteComment(user: User, comment: Comment): Promise<void> {
    try {
      if (comment.user.id !== user.id) {
        throw new InternalServerErrorException('You are not the owner');
      }
      await this.delete(comment.commentId);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
