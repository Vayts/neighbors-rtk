import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ERRORS } from '../constants/errors';
import { NeighborhoodService } from '../components/neighborhood/neighborhood.service';

@Injectable()
export class UserInNeighborhoodGuard implements CanActivate {
  constructor(private neighborhoodService: NeighborhoodService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { neighborhood_id } = req.query;
    try {
      const isUserInNeighborhood =
        await this.neighborhoodService.getNeighborhoodByMemberIdAndId(
          req.user._id,
          neighborhood_id,
        );

      return Boolean(isUserInNeighborhood);
    } catch (e) {
      throw new UnauthorizedException({ message: ERRORS.NO_ACCESS });
    }
  }
}
