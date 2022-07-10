import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferRepository } from './offer.repository';
import { HomeworkRepository } from '../homework/homework.repository';
import { OfferController } from './offer.controller';
import { UsersRepository } from '../auth/user.repository';
import { NotificationService } from '../devices/notification/notification.service';

import { HomeworkService } from '../homework/homework.service';
import { CommentRepository } from '../comments/comment.repository';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Notification } from 'src/devices/notification/entities/notification.entity';
import { DevicesModule } from '../devices/devices.module';

@Module({
  imports: [
    DevicesModule,
    TypeOrmModule.forFeature([
      OfferRepository,
      HomeworkRepository,
      UsersRepository,

      CommentRepository,
      Notification,
      Wallet,
    ]),
  ],
  providers: [OfferService, NotificationService, HomeworkService],
  controllers: [OfferController],
})
export class OfferModule {}
