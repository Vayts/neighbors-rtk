import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ERRORS } from '../constants/errors';
import { DutyService } from '../components/duty/duty.service';

@Injectable()
export class UserIsMarkAuthorGuard implements CanActivate {
  constructor(private dutyService: DutyService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { mark_id } = req.query;

    const res = await this.dutyService.getDutyMarkById(mark_id);

    if (res?.author_id.toString() !== req.user._id) {
      throw new ForbiddenException({ message: ERRORS.NO_ACCESS });
    } else {
      return true;
    }
  }
}
