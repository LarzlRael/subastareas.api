import {
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { Offer } from './entities/offer.entity';
import { OfferDto } from './dto/offer.dot';
import { NotificationService } from '../devices/notification/notification.service';

import { In, Repository, FindOptionsWhere } from 'typeorm';
import { validateArray } from '../utils/validation';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeworkService } from '../homework/homework.service';
import { Homework } from '../homework/entities/Homework.entity';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,

    @Inject(forwardRef(() => HomeworkService))
    private readonly homeworkService: HomeworkService,

    private readonly notificationService: NotificationService,
  ) {}

  async makeOffer(idHomework: number, offerDto: OfferDto, user: User) {
    const homework = await this.homeworkService.getOneHomeworkOfferAndUser(
      idHomework,
    );
    const getOfferAndUser = await this.getOffersByHomeworks(idHomework);

    if (!homework) {
      throw new InternalServerErrorException('Homework not found');
    }
    //verify if the user is the owner of the homework
    if (validateArray(getOfferAndUser.offers)) {
      const verifyOffer = getOfferAndUser.offers.some(
        (offer) => offer.user.id === user.id,
      );
      if (!verifyOffer) {
        return await this.saveOfferAndNotify(user, offerDto, homework);
      } else {
        throw new InternalServerErrorException('You already have an offer');
      }
    } else {
      return await this.saveOfferAndNotify(user, offerDto, homework);
    }
  }
  async saveOfferAndNotify(user: User, offerDto: OfferDto, homework: Homework) {
    const offer = this.offerRepository.create({
      user: user,
      homework: homework,
      priceOffer: offerDto.priceOffer,
    });
    await this.notificationService.sendNewOfferNotification(
      user,
      offerDto.priceOffer,
      homework,
    );
    const { id, priceOffer, status } = await this.offerRepository.save(offer);
    const offerWithUserSimple = {
      id,
      priceOffer,
      status,
      user: {
        id: user.id,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
      },
    };

    return offerWithUserSimple;
  }

  async getOffersSimpleData(idHomework: number) {
    const getHomeWork = await this.homeworkService.getOneHomeworkAll(
      idHomework,
    );
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
  async getOffersByHomeworks(idHomework: number) {
    const getHomeWork = await this.homeworkService.getOneHomeworkAll(
      idHomework,
    );
    if (!getHomeWork) {
      throw new InternalServerErrorException('Homework not found');
    }
    const offers = await this.offerRepository
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
    return { homework: getHomeWork, offers };
  }
  async deleteOffer(user: User, idOffer: number): Promise<Offer> {
    const getOffer = await this.getOfferWhere({
      id: idOffer,
    });
    if (!getOffer) {
      throw new InternalServerErrorException('Offer not found');
    }
    if (getOffer.user.id !== user.id) {
      throw new InternalServerErrorException(
        'You are not the owner of this offer',
      );
    }
    const findOffer = await this.getOfferWhere({ id: idOffer });
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
    idOffer: number,
    offerDto: OfferDto,
  ): Promise<Offer> {
    const getOffer = await this.getOfferWhere({
      id: idOffer,
    });
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
      where: {
        user: {
          id: user.id,
        },
      },
      relations: ['homework'],
    });
  }
  async getOffersReceiveByUser(user: User) {
    return this.homeworkService.getOffersReceiveByUser(user);
  }
  async getOfferedHomeworks(user: User): Promise<Offer[]> {
    return this.offerRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
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

    const homeworks = await this.homeworkService.getHomeworksByCondition({
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
    const offer = await this.getOfferWhere({ id: idOffer }, ['homework']);
    return offer;
  }
  async getOfferWhere(
    where: FindOptionsWhere<Offer> | FindOptionsWhere<Offer>[],
    relations?: string[],
  ) {
    return await this.offerRepository.findOne({
      where: where,
      relations: relations,
    });
  }

  async getOffersByHomework(idHomework: number) {
    const homework = await this.homeworkService.getOneHomeworkAll(idHomework);
    if (!homework) {
      throw new InternalServerErrorException('Homework not found');
    }
    return await this.offerRepository
      .createQueryBuilder('offer')
      .where({ homework: homework })
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
}
//TODO usar esto
/* SELECT t.solvedHomeworkUrl, t.id as tradeId, h.id
from trade t inner join offer o on 
t.offerId  = o.id 
inner join homework h 
on h.id = o.homeworkId 
where t.id = 14 */
