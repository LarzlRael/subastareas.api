import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferRepository } from './offer.repository';
import { HomeworkRepository } from '../homework/homework.repository';
import { OfferController } from './offer.controller';
import { UsersRepository } from '../auth/user.repository';
import { NotificationService } from '../devices/notification/notification.service';
import { DeviceRepository } from '../devices/device.repository';
import { NotificationRepository } from '../devices/notification/repository/notification.repository';
import { HomeworkService } from '../homework/homework.service';
import { CommentRepository } from '../comments/comment.repository';
import { WalletRepository } from '../wallet/wallet.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OfferRepository,
      HomeworkRepository,
      UsersRepository,
      DeviceRepository,
      NotificationRepository,
      CommentRepository,
      WalletRepository,
    ]),
  ],
  providers: [OfferService, NotificationService, HomeworkService],
  controllers: [OfferController],
})
export class OfferModule {}
