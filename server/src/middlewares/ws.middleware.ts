import { Socket } from 'socket.io';
import { wsJwtGuard } from '../guards/wsJwt.guard';
import { UnauthorizedException } from '@nestjs/common';
import { ERRORS } from '../constants/errors';

type SocketIOMiddleware = {
  (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (): SocketIOMiddleware => {
  return (client, next) => {
    try {
      wsJwtGuard.validateToken(client);
      next();
    } catch (error) {
      next(new UnauthorizedException('xxx'));
    }
  };
};
