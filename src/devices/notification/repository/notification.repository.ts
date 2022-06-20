import { EntityRepository, Repository } from 'typeorm';
/* import { Offer } from './entities/offer.entity';
import { OfferDto } from './dto/offer.dot';
import { Homework } from '../homework/entities/Homework.entity';
import { User } from '../auth/entities/user.entity';
import { validateArray } from '../utils/validation'; */
import { InternalServerErrorException } from '@nestjs/common';
import { Notification } from '../entities/notification.entity';

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  /* async createNotification() {} */
}
