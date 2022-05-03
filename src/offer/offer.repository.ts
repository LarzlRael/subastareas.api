import { EntityRepository, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { OfferDto } from './dto/offer.dot';
import { Homework } from '../homework/entities/Homework.entity';
import { User } from '../auth/entities/user.entity';

@EntityRepository(Offer)
export class OfferRepository extends Repository<Offer> {
  async makeOffer(
    homework: Homework,
    user: User,
    offetDto: OfferDto,
  ): Promise<Offer> {
    const offer = this.create({
      homeWork: homework,
      priceOffer: offetDto.priceOffer,
    });
    return await this.save(offer);
  }
  async getOffersByHomeworks(homework: Homework): Promise<Offer[]> {
    return await this.find({
      where: { homeWork: homework },
    });
  }
}
