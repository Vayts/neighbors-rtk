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
import { JwtAuthGuard } from '../../guards/JwtAuth.guard';
import { DebtorExistAndInNeighborhoodGuard } from '../../guards/DebtorExistAndInNeighborhood.guard';
import { CreateDebtDto } from '../../dto/create-debt.dto';
import { UserIsDebtAuthor } from '../../guards/UserIsDebtAuthor.guard';
import { EditDebtDto } from '../../dto/edit-debt.dto';
import { AddDebtAmountBiggerThanRepaidGuard } from '../../guards/AddDebtAmountBiggerThanRepaid.guard';
import { ValidNeighborhoodIdGuard } from '../../guards/ValidNeighborhoodId.guard';
import { ValidDebtIdGuard } from '../../guards/ValidDebtId.guard';

@Controller(ROUTES.DEBT.DEFAULT)
export class DebtController {
  constructor(private debtService: DebtService) {}

  @Post(ROUTES.DEBT.CREATE)
  @UseGuards(JwtAuthGuard, DebtorExistAndInNeighborhoodGuard)
  createDebt(@Req() request: Request, @Body() dto: CreateDebtDto) {
    return this.debtService.createDebt(request, dto);
  }

  @Put(ROUTES.DEBT.EDIT)
  @UseGuards(JwtAuthGuard, UserIsDebtAuthor, ValidDebtIdGuard)
  editDebt(@Req() request: Request, @Body() dto: EditDebtDto, @Query() query) {
    return this.debtService.editDebt(dto, query.debt_id);
  }

  @Put(ROUTES.DEBT.ADD_PAYMENT)
  @UseGuards(
    JwtAuthGuard,
    UserIsDebtAuthor,
    AddDebtAmountBiggerThanRepaidGuard,
    ValidDebtIdGuard,
  )
  addPaymentDebt(@Query() query, @Body() value: { amount: string }) {
    return this.debtService.addPaymentDebt(query.debt_id, Number(value.amount));
  }

  @Get(ROUTES.DEBT.GET_USER_DEBTS)
  @UseGuards(JwtAuthGuard)
  getUserDebts(@Req() request: Request) {
    return this.debtService.getAllUserDebts(request);
  }

  @Get(ROUTES.DEBT.GET_USER_DEBTS_BY_ID)
  @UseGuards(JwtAuthGuard, ValidNeighborhoodIdGuard)
  getUserDebtsById(@Req() request: Request, @Query() query) {
    return this.debtService.getUserDebtsById(request, query.neighborhood_id);
  }

  @Put(ROUTES.DEBT.CLOSE_DEBT)
  @UseGuards(JwtAuthGuard, UserIsDebtAuthor, ValidDebtIdGuard)
  closeDebt(@Query() query) {
    return this.debtService.closeDebt(query.debt_id);
  }

  @Delete(ROUTES.DEBT.DELETE)
  @UseGuards(JwtAuthGuard, UserIsDebtAuthor, ValidDebtIdGuard)
  deleteDebt(@Query() query) {
    return this.debtService.deleteDebt(query.debt_id);
  }
}
