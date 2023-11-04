import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DUTY_ERRORS } from '../constants/errors';
import { DutyService } from '../components/duty/duty.service';

@Injectable()
export class DutyMarkAlreadyExist implements CanActivate {
  constructor(private dutyService: DutyService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { duty_id } = req.query;
    const { date } = req.body;

    const res = await this.dutyService.getDutyMarkByDateAndDutyId(
      date,
      duty_id,
    );

    if (res) {
      throw new ForbiddenException({ message: DUTY_ERRORS.MARK_ALREADY_EXIST });
    } else {
      return true;
    }
  }
}
