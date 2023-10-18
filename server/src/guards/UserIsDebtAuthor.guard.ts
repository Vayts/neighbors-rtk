import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ERRORS } from '../constants/errors';
import { DebtService } from '../components/debt/debt.service';

@Injectable()
export class UserIsDebtAuthor implements CanActivate {
  constructor(private debtService: DebtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { debt_id } = req.query;
    const { _id } = req.user;
    try {
      const debt = await this.debtService.getDebtById(debt_id);
      return Boolean(debt[0].author._id.toString() === _id);
    } catch (e) {
      throw new UnauthorizedException({ message: ERRORS.NO_ACCESS });
    }
  }
}
