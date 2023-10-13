import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DebtService } from './debt.service';
import { ROUTES } from '../../constants/routes';
import { FormDataRequest } from 'nestjs-form-data';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';
import { debtorExistAndInNeighborhoodGuard } from '../../guards/debtorExistAndInNeighborhood.guard';
import { CreateDebtDto } from '../../dto/create-debt.dto';
import { userIsDebtAuthor } from '../../guards/userIsDebtAuthor.guard';
import { EditDebtDto } from '../../dto/edit-debt.dto';
import { addDebtAmountBiggerThanRepaidGuard } from '../../guards/addDebtAmountBiggerThanRepaid.guard';

@Controller(ROUTES.DEBT.DEFAULT)
export class DebtController {
  constructor(private debtService: DebtService) {}

  @Post(ROUTES.DEBT.CREATE)
  @UseGuards(JwtAuthGuard, debtorExistAndInNeighborhoodGuard)
  createDebt(@Req() request: Request, @Body() dto: CreateDebtDto) {
    return this.debtService.createDebt(request, dto);
  }

  @Put(ROUTES.DEBT.EDIT)
  @UseGuards(JwtAuthGuard, userIsDebtAuthor)
  editDebt(@Req() request: Request, @Body() dto: EditDebtDto, @Query() query) {
    return this.debtService.editDebt(dto, query.debt_id);
  }

  @Put(ROUTES.DEBT.ADD_PAYMENT)
  @UseGuards(JwtAuthGuard, userIsDebtAuthor, addDebtAmountBiggerThanRepaidGuard)
  addPaymentDebt(@Query() query, @Body() value: { amount: string }) {
    return this.debtService.addPaymentDebt(query.debt_id, Number(value.amount));
  }

  @Get(ROUTES.DEBT.GET_USER_DEBTS)
  @FormDataRequest()
  @UseGuards(JwtAuthGuard)
  getUserDebts(@Req() request: Request) {
    return this.debtService.getUserDebts(request);
  }

  @Put(ROUTES.DEBT.CLOSE_DEBT)
  @FormDataRequest()
  @UseGuards(JwtAuthGuard, userIsDebtAuthor)
  closeDebt(@Query() query) {
    return this.debtService.closeDebt(query.debt_id);
  }

  @Delete(ROUTES.DEBT.DELETE)
  @FormDataRequest()
  @UseGuards(JwtAuthGuard, userIsDebtAuthor)
  deleteDebt(@Query() query) {
    return this.debtService.deleteDebt(query.debt_id);
  }
}
