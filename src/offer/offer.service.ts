import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OfferRepository } from './offer.repository';
import { HomeworkRepository } from '../homework/homework.repository';
import { OfferDto } from './dto/offer.dot';
import { User } from 'src/auth/entities/user.entity';
import { Offer } from './entities/offer.entity';
import { NotificationService } from '../devices/notification/notification.service';
import { HomeWorkStatusEnum } from '../enums/enums';
import { In } from 'typeorm';

@Injectable()
export class OfferService {
  constructor(
    private offerRepository: OfferRepository,
    private homeworkRepository: HomeworkRepository,
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
    const offers = await this.offerRepository.find({
      where: { user },
      relations: ['homework'],
      order: { created_at: 'DESC' },
    });
    const idsHomeworks = offers
      .filter(
        (offer) =>
          offer.homework.status === HomeWorkStatusEnum.PENDING_TO_RESOLVE,
      )
      .map((offer) => {
        console.log(offer)
      });
    console.log(idsHomeworks);
    /* return await this.homeworkRepository.find({
      where: { id: In(idsHomeworks) },
      relations: ['user', 'offers'],
    }); */
  }
}
