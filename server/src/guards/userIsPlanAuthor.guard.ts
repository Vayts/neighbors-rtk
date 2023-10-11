import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ERRORS } from '../constants/errors';
import { PlanService } from '../components/plan/plan.service';

@Injectable()
export class userIsPlanAuthor implements CanActivate {
  constructor(private planService: PlanService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { plan_id } = req.query;
    const { _id } = req.user;
    try {
      const debt = await this.planService.getPlanById(plan_id);
      return Boolean(debt.author._id.toString() === _id);
    } catch (e) {
      throw new UnauthorizedException({ message: ERRORS.NO_ACCESS });
    }
  }
}
