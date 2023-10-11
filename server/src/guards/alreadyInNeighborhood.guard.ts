import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { NeighborhoodService } from '../components/neighborhood/neighborhood.service';
import { NEIGHBORHOOD_ERRORS } from '../constants/errors';

@Injectable()
export class AlreadyInNeighborhoodGuard implements CanActivate {
  constructor(private neighborhoodService: NeighborhoodService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { code, id } = req.query;
    const data = await this.neighborhoodService.getNeighborhoodByInviteCode(
      code,
    );

    if (data.neighborhood._id.toString() !== id) {
      throw new HttpException(
        { message: NEIGHBORHOOD_ERRORS.NEIGHBORHOOD_NOT_FOUND },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isUserInNeighborhood =
      await this.neighborhoodService.getNeighborhoodByMemberIdAndId(
        req.user._id,
        data.neighborhood._id,
      );

    if (isUserInNeighborhood) {
      throw new HttpException(
        { message: NEIGHBORHOOD_ERRORS.ALREADY_IN_NEIGHBORHOOD },
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }
}
