import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ERRORS } from '../constants/errors';
import mongoose from 'mongoose';
import { InvalidDataException } from '../exception/invalidData.exception';

@Injectable()
export class ValidDutyIdGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { duty_id } = req.query;

    if (mongoose.isValidObjectId(duty_id)) {
      return true;
    }

    throw new InvalidDataException(ERRORS.INVALID_DATA);
  }
}
