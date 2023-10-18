import { Socket } from 'socket.io';
import { WsJwtGuard } from '../guards/WsJwt.guard';
import { UnauthorizedException } from '@nestjs/common';

type SocketIOMiddleware = {
  (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (): SocketIOMiddleware => {
  return (client, next) => {
    try {
      WsJwtGuard.validateToken(client);
      next();
    } catch (error) {
      next(new UnauthorizedException('xxx'));
    }
  };
};
