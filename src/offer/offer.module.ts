import { Module, forwardRef } from '@nestjs/common';
import { OfferService } from './offer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferController } from './offer.controller';

import { NotificationService } from '../devices/notification/notification.service';

import { HomeworkService } from '../homework/homework.service';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Notification } from 'src/devices/notification/entities/notification.entity';
import { DevicesModule } from '../devices/devices.module';
import { CommentsService } from '../comments/comments.service';
import { Comment } from 'src/comments/entities/comment.entity';
import { Offer } from './entities/offer.entity';
import { HomeworkModule } from '../homework/homework.module';
import { Homework } from 'src/homework/entities/Homework.entity';

@Module({
  imports: [
    DevicesModule,
    forwardRef(() => HomeworkModule),
    TypeOrmModule.forFeature([Offer]),
  ],
  providers: [
    OfferService,
    NotificationService,
    HomeworkService,
    CommentsService,
  ],
  controllers: [OfferController],
  exports: [OfferService],
})
export class OfferModule {}
