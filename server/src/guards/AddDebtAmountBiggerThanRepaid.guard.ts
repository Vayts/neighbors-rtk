import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DEBT_ERRORS } from '../constants/errors';
import { DebtService } from '../components/debt/debt.service';
import { InvalidDataException } from '../exception/invalidData.exception';

@Injectable()
export class AddDebtAmountBiggerThanRepaidGuard implements CanActivate {
  constructor(private debtService: DebtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { debt_id } = req.query;
    const { amount } = req.body;

    try {
      const debt = await this.debtService.getDebtById(debt_id);
      return Boolean(
        debt[0].repaidAmount + Number(amount) <= debt[0].debtAmount,
      );
    } catch (e) {
      throw new InvalidDataException({
        message: DEBT_ERRORS.WRONG_NEW_DEBT_AMOUNT,
      });
    }
  }
}
