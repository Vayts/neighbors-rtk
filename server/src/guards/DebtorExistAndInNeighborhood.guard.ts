import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { NeighborhoodService } from '../components/neighborhood/neighborhood.service';
import { ERRORS, NEIGHBORHOOD_ERRORS } from '../constants/errors';
import mongoose from 'mongoose';

@Injectable()
export class DebtorExistAndInNeighborhoodGuard implements CanActivate {
  constructor(private neighborhoodService: NeighborhoodService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { debtor_id, neighborhood_id } = req.query;

    const isValidDebtorId = mongoose.Types.ObjectId.isValid(debtor_id);
    const isValidNeighborhoodId =
      mongoose.Types.ObjectId.isValid(neighborhood_id);

    if (!isValidDebtorId || !isValidNeighborhoodId) {
      throw new HttpException(
        { message: ERRORS.INVALID_DATA },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isInNeighborhood =
      await this.neighborhoodService.getNeighborhoodByMemberIdAndId(
        debtor_id,
        neighborhood_id,
      );

    if (isInNeighborhood) {
      return true;
    }

    throw new HttpException(
      { message: NEIGHBORHOOD_ERRORS.USER_NOT_IN_NEIGHBORHOOD },
      HttpStatus.BAD_REQUEST,
    );
  }
}
