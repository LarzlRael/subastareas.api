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
  getPlanes() {
    return this.planesServices.getPlanes();
  }
}
