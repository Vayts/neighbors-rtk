import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ERRORS } from '../constants/errors';
import { PlanService } from '../components/plan/plan.service';
import mongoose from 'mongoose';

@Injectable()
export class UserInPlanGuard implements CanActivate {
  constructor(private planService: PlanService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { plan_id } = req.query;
    try {
      const plan = await this.planService.getPlanById(
        new mongoose.Types.ObjectId(plan_id),
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
