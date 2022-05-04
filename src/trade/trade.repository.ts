import { EntityRepository, Repository } from 'typeorm';
import { Trade } from './entities/trade.entity';
import { Offer } from '../offer/entities/offer.entity';

@EntityRepository(Trade)
export class TradeRepository extends Repository<Trade> {
  async newTrade(offer: Offer, solvedHomeworkUrl: string): Promise<Trade> {
    const createTrade = this.create({
      offer,
      finalAmount: offer.priceOffer,
      solvedHomeworkUrl: solvedHomeworkUrl,
    });
    return await this.save(createTrade);
  }
}
