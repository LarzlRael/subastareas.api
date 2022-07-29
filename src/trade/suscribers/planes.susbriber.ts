import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Planes } from '../entities/planes.entity';
@EventSubscriber()
export class PlanesSubscriber implements EntitySubscriberInterface<Planes> {
  listenTo(): any {
    return Planes;
  }
  beforeInsert(event: InsertEvent<Planes>): void | Promise<any> {
    /* const ratio = 3.1; */
    const googleCommissionPercentage = 0.3;
    const gemPrice =
      event.entity.rate /
      (event.entity.dollarAmount * event.entity.currencyPriceUSDToday);
    console.log(gemPrice);
    const googleCommission =
      (gemPrice * googleCommissionPercentage) /
      (1 - googleCommissionPercentage);
    event.entity.currencyPrice = gemPrice;
    event.entity.googleCommission = googleCommission;
    event.entity.plan200 = (googleCommission + gemPrice) * 0.98 * 200;
    event.entity.plan100 = (googleCommission + gemPrice) * 0.99 * 100;
    event.entity.plan50 = (googleCommission + gemPrice) * 0.995 * 50;
    event.entity.plan25 = (googleCommission + gemPrice) * 0.995 * 25;
    event.entity.plan10 = (googleCommission + gemPrice) * 0.99 * 10;
    event.entity.plan5 = (googleCommission + gemPrice) * 0.99 * 5;
    event.entity.plan1 = (googleCommission + gemPrice) * 1 * 1;
  }
  afterInsert(event: InsertEvent<Planes>): void | Promise<any> {
    console.log('afterInsert');
    console.log(event.entity);
  }
  beforeUpdate(event: UpdateEvent<Planes>): void | Promise<any> {}
}
