import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepository } from './comment.repository';

import { HomeworkRepository } from '../homework/homework.repository';
import { NotificationService } from '../devices/notification/notification.service';
import { Notification } from 'src/devices/notification/entities/notification.entity';
import { DevicesService } from '../devices/devices.service';
import { Device } from '../devices/entities/devices.entity';
import { DeviceRepository } from '../devices/device.repository';
import { DevicesModule } from '../devices/devices.module';

@Module({
  imports: [
    DevicesModule,
    TypeOrmModule.forFeature([
      CommentRepository,
      HomeworkRepository,
      DeviceRepository,
      Notification,
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, NotificationService],
  exports: [CommentsService],
})
export class CommentsModule {}
