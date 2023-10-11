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
import { PlanService } from './plan.service';
import { ROUTES } from '../../constants/routes';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';
import { CreatePlanDto } from '../../dto/create-plan.dto';
import { userInNeighborhoodGuard } from '../../guards/userInNeighborhood.guard';
import { userInPlanGuard } from '../../guards/userInPlan.guard';
import { addPlanAmountBiggerThanRepaidGuard } from '../../guards/addPlanAmountBiggerThanRepaid.guard';
import { userIsPlanAuthor } from '../../guards/userIsPlanAuthor.guard';
import { EditPlanDto } from '../../dto/edit-plan.dto';
import { newPlanAmountBiggerThanRepaidGuard } from '../../guards/newPlanAmountBiggerThanAlreadyRepaid.guard';

@Controller(ROUTES.PLAN.DEFAULT)
export class PlanController {
  constructor(private planService: PlanService) {}

  @Post(ROUTES.PLAN.CREATE)
  @UseGuards(JwtAuthGuard, userInNeighborhoodGuard)
  createPlan(@Req() req: Request, @Body() dto: CreatePlanDto) {
    return this.planService.createPlan(req, dto);
  }

  @Get(ROUTES.PLAN.GET_USER_PLANS)
  @UseGuards(JwtAuthGuard)
  getUserPlans(@Req() req: Request) {
    return this.planService.getUserPlans(req);
  }

  @Put(ROUTES.PLAN.CHANGE_TASK_STATUS)
  @UseGuards(JwtAuthGuard, userInPlanGuard)
  changeTaskStatus(@Query() query, @Req() req: Request) {
    return this.planService.changeTaskStatus(query.plan_id, query.task_id, req);
  }

  @Put(ROUTES.PLAN.ADD_PAYMENT)
  @UseGuards(JwtAuthGuard, userInPlanGuard, addPlanAmountBiggerThanRepaidGuard)
  addPayment(
    @Query() query,
    @Req() req: Request,
    @Body() value: { amount: string },
  ) {
    return this.planService.addPayment(
      query.plan_id,
      req,
      Number(value.amount),
    );
  }

  @Put(ROUTES.PLAN.CLOSE_PLAN)
  @UseGuards(JwtAuthGuard, userIsPlanAuthor)
  closePlan(@Query() query) {
    return this.planService.closePlan(query.plan_id);
  }

  @Put(ROUTES.PLAN.REOPEN_PLAN)
  @UseGuards(JwtAuthGuard, userIsPlanAuthor)
  reopenPlan(@Query() query) {
    return this.planService.reopenPlan(query.plan_id);
  }

  @Delete(ROUTES.PLAN.DELETE)
  @UseGuards(JwtAuthGuard, userIsPlanAuthor)
  deletePlan(@Query() query) {
    return this.planService.deletePlan(query.plan_id);
  }

  @Put(ROUTES.PLAN.EDIT)
  @UseGuards(JwtAuthGuard, userIsPlanAuthor, newPlanAmountBiggerThanRepaidGuard)
  editDebt(@Req() request: Request, @Body() dto: EditPlanDto, @Query() query) {
    return this.planService.editPlan(dto, query.plan_id);
  }
}
