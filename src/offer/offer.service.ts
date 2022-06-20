import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OfferRepository } from './offer.repository';
import { HomeworkRepository } from '../homework/homework.repository';
import { OfferDto } from './dto/offer.dot';
import { User } from 'src/auth/entities/user.entity';
import { Offer } from './entities/offer.entity';
import { NotificationService } from '../devices/notification/notification.service';
import { DeviceRepository } from '../devices/device.repository';

@Injectable()
export class OfferService {
  constructor(
    private offerRepository: OfferRepository,
    private homeworkRepository: HomeworkRepository,
    private deviceRepository: DeviceRepository,
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
      const gerUserDevices = await this.deviceRepository.find({ user });
      console.log(gerUserDevices);
      this.notificationService.sendNewOfferNotification(
        user,
        gerUserDevices.map((device) => device.idDevice),
        offerDto.priceOffer,
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
  async getOfferedHomeworkds(user: User): Promise<Offer[]> {
    return this.offerRepository.find({
      where: { user },
      relations: ['homework'],
    });
  }
}
