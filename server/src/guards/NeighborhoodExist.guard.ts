import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { NEIGHBORHOOD_ERRORS } from '../constants/errors';
import { NeighborhoodService } from '../components/neighborhood/neighborhood.service';
import { InvalidDataException } from '../exception/invalidData.exception';

@Injectable()
export class NeighborhoodExistGuard implements CanActivate {
  constructor(private neighborhoodService: NeighborhoodService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { neighborhood_id } = req.query;

    try {
      const userInNeighborhood =
        await this.neighborhoodService.getNeighborhoodById(neighborhood_id);

      return Boolean(userInNeighborhood.length);
    } catch (e) {
      throw new InvalidDataException(
        NEIGHBORHOOD_ERRORS.NEIGHBORHOOD_NOT_FOUND,
      );
    }
  }
}
