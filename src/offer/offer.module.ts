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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OfferRepository,
      HomeworkRepository,
      UsersRepository,
      DeviceRepository,
      NotificationRepository,
    ]),
  ],
  providers: [OfferService, NotificationService],
  controllers: [OfferController],
})
export class OfferModule {}
