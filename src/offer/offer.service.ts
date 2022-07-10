import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HomeworkRepository } from '../homework/homework.repository';
import { OfferDto } from './dto/offer.dot';
import { User } from 'src/auth/entities/user.entity';
import { Offer } from './entities/offer.entity';
import { NotificationService } from '../devices/notification/notification.service';

import { In, Repository } from 'typeorm';
import { validateArray } from '../utils/validation';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private homeworkRepository: HomeworkRepository,
    private notificationService: NotificationService,
  ) {}

  async makeOffer(idHomework: string, offerDto: OfferDto, user: User) {
    const homework = await this.homeworkRepository.findOne(idHomework, {
      relations: ['offers', 'user'],
    });

    if (!homework) {
      throw new InternalServerErrorException('Homework not found');
    }
    if (validateArray(homework.offers)) {
      const verifyOffer = homework.offers.some(
        (offer) => offer.user.id === user.id,
      );
      if (!verifyOffer) {
        const offer = this.offerRepository.create({
          user: user,
          homework: homework,
          priceOffer: offerDto.priceOffer,
        });

        await this.offerRepository.save(offer);

        if (offer) {
          this.notificationService.sendNewOfferNotification(
            user,
            offerDto.priceOffer,
            homework,
          );
        }
      } else {
        throw new InternalServerErrorException('You already have an offer');
      }
    } else {
      const offer = this.offerRepository.create({
        user: user,
        homework: homework,
        priceOffer: offerDto.priceOffer,
      });
      await this.offerRepository.save(offer);
      return true;
    }
  }

  async getOffersByHomeworks(idHomework: number): Promise<Offer[]> {
    const getHomeWork = await this.homeworkRepository.findOne(idHomework);
    if (!getHomeWork) {
      throw new InternalServerErrorException('Homework not found');
    }
    return await this.offerRepository
      .createQueryBuilder('offer')
      .where({ homework: getHomeWork })
      .select([
        'offer.id',
        'offer.priceOffer',
        'offer.status',
        /* 'offer.createdAt', */
        'user.id',
        'user.username',
        'user.profileImageUrl',
        /* 'user.email', */
      ])
      .leftJoin('offer.user', 'user') // bar is the joined table
      .getMany();
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
    const findOffer = await this.offerRepository.findOne(idOffer);
    if (findOffer.user.id === user.id) {
      await this.offerRepository.delete(idOffer);
      return findOffer;
    } else {
      throw new InternalServerErrorException(
        'You are not the owner of this offer',
      );
    }
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

  async saveOffer(offer: Offer) {
    return await this.offerRepository.save(offer);
  }
  async getOneOffer(idOffer: number) {
    const offer = await this.offerRepository.findOne(idOffer, {
      relations: ['homework'],
    });
    return offer;
  }
}

//TODO usar esto
/* SELECT t.solvedHomeworkUrl, t.id as tradeId, h.id
from trade t inner join offer o on 
t.offerId  = o.id 
inner join homework h 
on h.id = o.homeworkId 
where t.id = 14 */
