import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DutyService } from '../components/duty/duty.service';
import { ERRORS } from '../constants/errors';

@Injectable()
export class UserIsDutyAuthorGuard implements CanActivate {
  constructor(private dutyService: DutyService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { duty_id } = req.query;
    const res = await this.dutyService.getById(duty_id);

    if (res?.author._id.toString() !== req.user._id) {
      throw new ForbiddenException({ message: ERRORS.NO_ACCESS });
    } else {
      return true;
    }
  }
}
