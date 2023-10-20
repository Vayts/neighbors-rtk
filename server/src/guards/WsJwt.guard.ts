import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') return true;
    const client: Socket = context.switchToWs().getClient();

    try {
      WsJwtGuard.validateToken(client);

      return true;
    } catch (e) {
      client.emit('tokenExpired', e);
      client.disconnect();
    }
  }

  static validateToken(client: Socket) {
    const token = client.handshake.auth.token;

    const user = verify(token, process.env.JWT_ACCESS_SECRET || 'access');

    return user;
  }
}
