import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OfferRepository } from './offer.repository';
import { HomeworkRepository } from '../homework/homework.repository';
import { OfferDto } from './dto/offer.dot';
import { User } from 'src/auth/entities/user.entity';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OfferService {
  constructor(
    private offerRepository: OfferRepository,
    private HomeworkRepository: HomeworkRepository,
  ) {}

  async makeOffer(
    idHomework: string,
    offerDto: OfferDto,
    user: User,
  ): Promise<Offer> {
    const getHomeWork = await this.HomeworkRepository.findOne(idHomework);
    if (!getHomeWork) {
      throw new InternalServerErrorException('Homework not found');
    }
    return this.offerRepository.makeOffer(getHomeWork, user, offerDto);
  }

  async getOffersByHomeworks(idHomework: string): Promise<Offer[]> {
    const getHomeWork = await this.HomeworkRepository.findOne(idHomework);
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
}
