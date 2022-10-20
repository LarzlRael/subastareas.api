import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  UseGuards,
  Delete,
  Put,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferDto } from './dto/offer.dot';
import { GetUser } from '../auth/decorators/get-user..decorator';
import { User } from '../auth/entities/user.entity';
import { RolesGuard } from '../auth/guard/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/get.rols.decorator';
import { RoleEnum } from '../enums/enums';

@Controller('offer')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OfferController {
  constructor(private offerService: OfferService) {}

  /* @Roles(RoleEnum.PROFESSOR) */
  @Post('makeOffer/:idHomework')
  makeOffer(
    @GetUser() user: User,
    @Body() offerDot: OfferDto,
    @Param('idHomework') idHomework: number,
  ) {
    return this.offerService.makeOffer(idHomework, offerDot, user);
  }
  @Get('getUsersHomeworksPending')
  getUsersHomeworksPending(@GetUser() user: User) {
    return this.offerService.getUsersHomeworksPending(user);
  }
  @Get('getOfferSentByUser')
  getOfferSentByUser(@GetUser() user: User) {
    return this.offerService.getOfferSentByUser(user.id);
  }
  @Get('getOfferReceivedByUser')
  getOfferReceived(@GetUser() user: User) {
    return this.offerService.getOfferReceived(user.id);
  }
  @Get(':idHomework')
  getOfferByHomework(@Param('idHomework') idHomework: number) {
    return this.offerService.getOffersByHomeworks(idHomework);
  }

  @Put('editOffer/:idOffer')
  editOffer(
    @GetUser() user: User,
    @Param('idOffer') idOffer: number,
    @Body() offerDot: OfferDto,
  ) {
    return this.offerService.editOffer(user, idOffer, offerDot);
  }
  @Delete(':idOffer')
  deleteOffer(@GetUser() user: User, @Param('idOffer') idOffer: number) {
    return this.offerService.deleteOffer(user, idOffer);
  }
}
