import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { NEIGHBORHOOD_ERRORS } from '../constants/errors';
import { NeighborhoodService } from '../components/neighborhood/neighborhood.service';

@Injectable()
export class InviteCodeExistAndNotExpiredGuard implements CanActivate {
  constructor(private neighborhoodService: NeighborhoodService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { code } = req.query;
    const neighborhood =
      await this.neighborhoodService.getNeighborhoodByInviteCode(code);

    if (!neighborhood) {
      throw new HttpException(
        { message: NEIGHBORHOOD_ERRORS.NEIGHBORHOOD_NOT_FOUND },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (new Date(neighborhood.expirationDate) < new Date()) {
      throw new HttpException(
        { message: NEIGHBORHOOD_ERRORS.INVITE_CODE_EXPIRED },
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }
}
