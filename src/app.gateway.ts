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
import { OfferRoomI } from './interfaces/common';

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

  @SubscribeMessage('joinOfferRoom')
  async handleJoinOfferRoom(client: Socket, room: string) {
    client.join(room);
    this.wss
      .to(room)
      .emit('joinOfferRoom', await this.getClientActive(client, room));
  }
  @SubscribeMessage('leaveOfferRoom')
  async handleLeaveOfferRoom(client: Socket, room: string) {
    client.leave(room);
    this.wss
      .to(room)
      .emit('leaveOfferRoom', await this.getClientActive(client, room));
  }
  async getClientActive(client: Socket, room: string) {
    const number = await client.in(room).allSockets();
    return number.size;
  }

  @SubscribeMessage('makeOfferToServer')
  handleMakeOffer(client: Socket, { room, offer }: OfferRoomI): void {
    this.emitAndSend({ offer, room }, 'add', 'makeOfferToClient');
  }
  @SubscribeMessage('editOffer')
  async handleEditOffer(client: Socket, { room, offer }: OfferRoomI) {
    this.emitAndSend({ offer, room }, 'edit', 'editOffer');
  }
  @SubscribeMessage('deleteOffer')
  async handleDeleteOffer(client: Socket, { room, offer }: OfferRoomI) {
    this.emitAndSend({ offer, room }, 'delete', 'deleteOffer');
  }

  emitAndSend({ offer, room }: OfferRoomI, type: string, typeEmit: string) {
    const offerWithType = {
      ...offer,
      type: type,
    };
    this.wss.to(room).emit(typeEmit, JSON.stringify(offerWithType));
  }
}
