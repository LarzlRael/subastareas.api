import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { NotificationService } from '../devices/services/notification.service';

@Injectable()
export class SocketService {
  constructor(private notificationService: NotificationService) {}
  public socket: Server = null;

  getNotification() {
    
  }
}
