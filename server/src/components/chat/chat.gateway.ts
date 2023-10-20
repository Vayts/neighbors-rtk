import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ServerToClientChatEvents } from '../../types/chat.types';
import { ChatService } from './chat.service';
import { verify } from 'jsonwebtoken';
import { ERRORS } from '../../constants/errors';

@WebSocketGateway({ cors: '*' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<any, ServerToClientChatEvents>;
  users: Map<string, any> = new Map();

  constructor(private chatService: ChatService) {}

  async handleConnection(client: Socket): Promise<void> {
    const token = client.handshake.auth.token;
    try {
      const user = verify(token, process.env.JWT_ACCESS_SECRET || 'access');

      if (user) {
        this.users.set(client.id, user);

        await this.handleJoinRooms(client);
      }
    } catch (e) {
      if (e.message === 'jwt expired') {
        this.server.emit('tokenExpired', ERRORS.TOKEN_EXPIRED);
        client.disconnect();
      } else {
        client.disconnect();
      }
    }
  }

  handleDisconnect(client: Socket): void {
    this.users.delete(client.id);
  }

  @SubscribeMessage('joinNeighborhoodRooms')
  async handleJoinRooms(client: Socket) {
    const author = this.users.get(client.id);
    const roomsArr = await this.chatService.getChatRoomsByUserId(author._id);
    if (roomsArr.length) {
      client.join(roomsArr.map((item) => item._id));
      this.server.to(client.id).emit('joinedRooms', roomsArr);
    }
  }

  @SubscribeMessage('leaveNeighborhoodRoom')
  async handleLeaveRoom(client: Socket, roomName: string) {
    client.leave(roomName);
  }

  @SubscribeMessage('sendMessageToChat')
  async sendMessage(client: Socket, { message, roomId }) {
    const author = this.users.get(client.id);

    const data = await this.chatService.postMessage(
      author._id,
      message,
      roomId,
    );
    this.server.to(client.id).emit('updateUnseenMessage', data.idsToUpdate);
    this.server.emit('receiveMessage', data);
  }
}
