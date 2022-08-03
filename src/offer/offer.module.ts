import { Module, forwardRef } from '@nestjs/common';
import { OfferService } from './offer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferController } from './offer.controller';

import { NotificationService } from '../devices/services';

import { HomeworkService } from '../homework/homework.service';

import { DevicesModule } from '../devices/devices.module';
import { CommentsService } from '../comments/comments.service';
import { Comment } from '../comments/entities/comment.entity';
import { Offer } from './entities/offer.entity';
import { HomeworkModule } from '../homework/homework.module';
import { Homework } from '../homework/entities/Homework.entity';
import { Notification } from 'src/devices/entities';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    DevicesModule,
    WalletModule,
    forwardRef(() => HomeworkModule),
    TypeOrmModule.forFeature([Offer, Notification, Comment, Homework]),
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
