import { PlanesServices } from '../services/planes.service';
import {
  Controller,
  Post,
  Param,
  Get,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
} from '@nestjs/common';

@Controller('planes')
/* @UseGuards(AuthGuard('jwt')) */
export class PlanesController {
  constructor(private readonly planesServices: PlanesServices) {}

  @Get('getPriceDollar')
  getPriceDollar() {
    return this.planesServices.getDollarPriceToday();
  }
  @Get('getPlanes')
  async getPlanes() {
    const planes = await this.planesServices.getPlanes();
    const planeParse = Object.keys(planes).map((key) => {
      return {
        planeName: key,
        price: planes[key],
        amount: parseInt(key.substring(4, key.length)),
      };
    });
    return planeParse.reverse();
  }
}
