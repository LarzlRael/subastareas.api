import { Controller, UseGuards, Get, Param, Put } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/decorators/get-user..decorator';
import { User } from '../../auth/entities/user.entity';

@Controller('devices')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('/getUserNotifications')
  getUserNotification(@GetUser() user: User) {
    return this.notificationService.getUserNotification(user);
  }
  @Get('/deleteNotification/:idNotification')
  deleteNotification(
    @GetUser() user: User,
    @Param('idNotification') idNotification: string,
  ) {
    return this.notificationService.deleteNotification(idNotification);
  }
  @Put('/seeNotification/:idNotification')
  seeNotification(
    @GetUser() user: User,
    @Param('idNotification') idNotification: string,
  ) {
    return this.notificationService.seeNotification(idNotification);
  }
  @Get('/clearnotificated')
  clearNotificated(@GetUser() user: User) {
    return this.notificationService.clearNotificated(user);
  }
}
