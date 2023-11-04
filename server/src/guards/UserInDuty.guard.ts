import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ERRORS } from '../constants/errors';
import mongoose from 'mongoose';
import { DutyService } from '../components/duty/duty.service';

@Injectable()
export class UserInDutyGuard implements CanActivate {
  constructor(private dutyService: DutyService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { duty_id } = req.query;
    try {
      const plan = await this.dutyService.getById(
        new mongoose.Types.ObjectId(duty_id),
      );
      const user = plan.participants.find(
        (item) => item._id.toString() === req.user._id,
      );

      return Boolean(user);
    } catch (e) {
      throw new UnauthorizedException({ message: ERRORS.NO_ACCESS });
    }
  }
}
