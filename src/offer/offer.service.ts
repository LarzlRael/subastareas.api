import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OfferRepository } from './offer.repository';
import { HomeworkRepository } from '../homework/homework.repository';
import { OfferDto } from './dto/offer.dot';
import { User } from 'src/auth/entities/user.entity';
import { Offer } from './entities/offer.entity';
import { NotificationService } from '../devices/notification/notification.service';
import { HomeWorkStatusEnum } from '../enums/enums';
import { In } from 'typeorm';
import { HomeworkService } from '../homework/homework.service';

@Injectable()
export class OfferService {
  constructor(
    private offerRepository: OfferRepository,
    private homeworkRepository: HomeworkRepository,
    private homeworkService: HomeworkService,
    private notificationService: NotificationService,
  ) {}

  async makeOffer(idHomework: string, offerDto: OfferDto, user: User) {
    console.log('idehomerok: ' + idHomework);
    const getHomeWork = await this.homeworkRepository.findOne(idHomework, {
      relations: ['offers', 'user'],
    });

    if (!getHomeWork) {
      throw new InternalServerErrorException('Homework not found');
    }
    const offered = await this.offerRepository.makeOffer(
      getHomeWork,
      user,
      offerDto,
    );
    if (offered) {
      this.notificationService.sendNewOfferNotification(
        user,
        offerDto.priceOffer,
        getHomeWork,
      );
    }
  }

  async getOffersByHomeworks(idHomework: string): Promise<Offer[]> {
    const getHomeWork = await this.homeworkRepository.findOne(idHomework);
    if (!getHomeWork) {
      throw new InternalServerErrorException('Homework not found');
    }
    return this.offerRepository.getOffersByHomeworks(getHomeWork);
  }
  async deleteOffer(user: User, idOffer: string): Promise<Offer> {
    const getOffer = await this.offerRepository.findOne(idOffer);
    if (!getOffer) {
      throw new InternalServerErrorException('Offer not found');
    }
    if (getOffer.user.id !== user.id) {
      throw new InternalServerErrorException(
        'You are not the owner of this offer',
      );
    }
    return this.offerRepository.deleteOffer(user, idOffer);
  }
  async editOffer(
    user: User,
    idOffer: string,
    offerDto: OfferDto,
  ): Promise<Offer> {
    const getOffer = await this.offerRepository.findOne(idOffer);
    if (!getOffer) {
      throw new InternalServerErrorException('Homework not found');
    }
    if (getOffer.user.id !== user.id) {
      throw new InternalServerErrorException(
        'You are not the owner of this offer',
      );
    }
    return await this.offerRepository.save({
      ...getOffer,
      ...offerDto,
      edited: true,
    });
  }
  async getOffersSentByUser(user: User): Promise<Offer[]> {
    return this.offerRepository.find({
      where: { user },
      relations: ['homework'],
    });
  }
  async getOffersReceiveByUser(user: User) {
    return this.homeworkRepository.find({
      where: { user },
      relations: ['homework', 'offers'],
    });
  }
  async getOfferedHomeworks(user: User): Promise<Offer[]> {
    return this.offerRepository.find({
      where: { user },
      relations: ['homework'],
    });
  }
  async getUsersHomeworksPending(user: User) {
    const offers = await this.offerRepository.query(
      'select h.id as homeworkId , o.id as offerId  FROM offer o inner join homework h on h.id  = o.homeworkId  where o.userId  = ? and h.status = "pending_to_resolve"',
      [user.id],
    );
    /* [ { homeworkId: 11, offerId: 7 }, { homeworkId: 17, offerId: 8 } ] */

    const idsHomeworks = offers.map((offer) => offer.homeworkId);

    /*     const xd = await this.homeworkRepository.find({
      where: { id: In(idsHomeworks) },
      relations: ['user', 'offers'],
    }); */

    const homeworks = await this.homeworkRepository.getHomeworksByCondition({
      id: In(idsHomeworks),
    });
    console.log(homeworks);
    return homeworks.map((homework, i) => ({
      ...homework,
      offerId: offers[i].offerId,
    }));
  }
}



//TODO usar esto 
/* SELECT t.solvedHomeworkUrl, t.id as tradeId, h.id
from trade t inner join offer o on 
t.offerId  = o.id 
inner join homework h 
on h.id = o.homeworkId 
where t.id = 14 */