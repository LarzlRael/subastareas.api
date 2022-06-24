import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepository } from './comment.repository';

import { HomeworkRepository } from '../homework/homework.repository';
import { NotificationService } from '../devices/notification/notification.service';
import { DeviceRepository } from '../devices/device.repository';
import { NotificationRepository } from '../devices/notification/repository/notification.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentRepository,
      HomeworkRepository,
      DeviceRepository,
      NotificationRepository,
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, NotificationService],
  exports: [CommentsService, NotificationService],
})
export class CommentsModule {}
