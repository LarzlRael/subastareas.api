import { Controller, UseGuards, Get, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('devices')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
  /* constructor(private notificationService: NotificationService) {}
  @Get('/coment/:homewokId')
  sendCommentNotication(@Param('homewokId') homewokId: number) {
    return this.notificationService.sendCommentNotification(homewokId);
  } */
}
