import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepository } from './comment.repository';

import { HomeworkRepository } from '../homework/homework.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommentRepository, HomeworkRepository])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule { }
