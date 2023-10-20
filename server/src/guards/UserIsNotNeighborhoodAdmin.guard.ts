import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ERRORS } from '../constants/errors';
import { NeighborhoodService } from '../components/neighborhood/neighborhood.service';

@Injectable()
export class UserIsNotNeighborhoodAdminGuard implements CanActivate {
  constructor(private neighborhoodService: NeighborhoodService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { neighborhood_id } = req.query;
    try {
      const userInNeighborhood =
        await this.neighborhoodService.getNeighborhoodByMemberIdAndId(
          req.user._id,
          neighborhood_id,
        );
      return userInNeighborhood.role !== 'admin';
    } catch (e) {
      throw new UnauthorizedException({ message: ERRORS.NO_ACCESS });
    }
  }
}
