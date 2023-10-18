import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PLAN_ERRORS } from '../constants/errors';
import { PlanService } from '../components/plan/plan.service';

@Injectable()
export class AddPlanAmountBiggerThanRepaidGuard implements CanActivate {
  constructor(private planService: PlanService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { plan_id } = req.query;
    const { amount } = req.body;
    try {
      const plan = await this.planService.getPlanById(plan_id);

      if (!plan.isPaymentRequired) {
        return false;
      }

      return Boolean(
        plan.currentPayment + Number(amount) <= plan.paymentAmount,
      );
    } catch (e) {
      throw new UnauthorizedException({
        message: PLAN_ERRORS.WRONG_PAYMENT_AMOUNT,
      });
    }
  }
}
