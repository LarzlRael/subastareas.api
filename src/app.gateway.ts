import { Logger } from '@nestjs/common';

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway(3002, {
  cors: true,
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  @WebSocketServer() wss: Server;

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): void {
    /* client.emit() */
    /* return { event: 'msgToClient', data: 'Hello world!' }; */
    this.wss.emit('msgToClient', text);
  }
  @SubscribeMessage('makeOfferToServer')
  handleMakeOffer(
    client: Socket,
    textoffer: { room: string; offer: string },
  ): void {
    /* client.emit() */
    /* return { event: 'msgToClient', data: 'Hello world!' }; */
    console.log('makeOffer', textoffer.offer);
    console.log('makeOffer', textoffer.room);

    this.wss.to(textoffer.room).emit('makeOfferToClient', textoffer.offer);
  }
  @SubscribeMessage('joinOfferRoom')
  handleJoinOfferRoom(client: Socket, room: string): void {
    client.join(room);
    client.emit('joinOfferRoom', room);
  }
  @SubscribeMessage('leaveOfferRoom')
  handleLeaveOfferRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leaveOfferRoom', room);
  }
}
