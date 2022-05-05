import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferDto } from './dto/offer.dot';
import { GetUser } from 'src/auth/decorators/get-user..decorator';
import { User } from '../auth/entities/user.entity';
import { RolesGuard } from '../auth/guard/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/get.rols.decorator';
import { RoleEnum } from '../enums/enums';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('offer')
export class OfferController {
  constructor(private offerService: OfferService) {}

  @Roles(RoleEnum.PROFESSOR)
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
  @Delete(':idOffer')
  deleteOffer(@GetUser() user: User, @Param('idOffer') idOffer: string) {
    return this.offerService.deleteOffer(user, idOffer);
  }
}
