import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PLAN_ERRORS } from '../constants/errors';
import { PlanService } from '../components/plan/plan.service';
import { InvalidDataException } from '../exception/invalidData.exception';

@Injectable()
export class NewPlanAmountBiggerThanRepaidGuard implements CanActivate {
  constructor(private planService: PlanService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { plan_id } = req.query;
    const { paymentAmount } = req.body;
    try {
      const plan = await this.planService.getPlanById(plan_id);

      if (!plan.isPaymentRequired) {
        return true;
      }

      return Boolean(plan.currentPayment <= paymentAmount);
    } catch (e) {
      throw new InvalidDataException({
        message: PLAN_ERRORS.WRONG_NEW_PLAN_AMOUNT,
      });
    }
  }
}
