import { Module, forwardRef } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationService } from '../devices/notification/notification.service';
import { Notification } from '../devices/notification/entities/notification.entity';

import { DevicesModule } from '../devices/devices.module';
import { Comment } from './entities/comment.entity';
import { HomeworkModule } from '../homework/homework.module';
import { Homework } from 'src/homework/entities/Homework.entity';

@Module({
  imports: [
    forwardRef(() => HomeworkModule),
    DevicesModule,
    TypeOrmModule.forFeature([Comment, Notification, Homework]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, NotificationService],
  exports: [CommentsService],
})
export class CommentsModule {}
