import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferDto } from './dto/offer.dot';
import { GetUser } from 'src/auth/decorators/get-user..decorator';
import { User } from '../auth/entities/user.entity';

@Controller('offer')
export class OfferController {
  constructor(private offerService: OfferService) {}

  @Post('makeOffer/:idHomework')
  makeOffer(
    @GetUser() user: User,
    @Body() offerDot: OfferDto,
    @Param('idHomework') idHomework: string,
  ) {
    return this.offerService.makeOffer(idHomework, offerDot, user);
  }
  @Get(':idHomework')
  getOfferByHomework(@Param('idHomework') idHomework: string) {
    return this.offerService.getOffersByHomeworks(idHomework);
  }
}
