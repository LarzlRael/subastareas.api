import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HomeworkRepository } from '../homework/homework.repository';
import { NotificationService } from '../devices/notification/notification.service';
import { Notification } from 'src/devices/notification/entities/notification.entity';

import { DevicesModule } from '../devices/devices.module';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    DevicesModule,
    TypeOrmModule.forFeature([HomeworkRepository, Comment, Notification]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, NotificationService],
  exports: [CommentsService],
})
export class CommentsModule {}
