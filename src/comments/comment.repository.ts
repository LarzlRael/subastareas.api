import { EntityRepository, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { CommentDto } from './dto/comment.dto';
import { User } from '../auth/entities/user.entity';
import { Homework } from 'src/homework/entities/Homework.entity';

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
  async getCommentsByHomework(homeworkId: number): Promise<any[]> {
    try {
      return await this.createQueryBuilder('comment')
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
      console.log(error);

      throw new InternalServerErrorException();
    }
  }
  async deleteComment(user: User, comment: Comment): Promise<void> {
    try {
      if (comment.user.id !== user.id) {
        throw new InternalServerErrorException('You are not the owner');
      }
      await this.delete(comment.id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  async editComment(
    user: User,
    idComment: number,
    commentDto: CommentDto,
  ): Promise<CommentDto> {
    try {
      const getComment = await this.findOne(idComment);
      if (!getComment) {
        throw new InternalServerErrorException("comment doesn't exist");
      }
      if (getComment.user.id !== user.id) {
        throw new InternalServerErrorException('You are not the owner');
      }
      const commentEdit = await this.save({
        ...getComment,
        ...commentDto,
        edited: true,
      });
      return commentEdit;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
