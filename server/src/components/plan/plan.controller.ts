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
import { JwtAuthGuard } from '../../guards/JwtAuth.guard';
import { CreatePlanDto } from '../../dto/create-plan.dto';
import { UserInNeighborhoodGuard } from '../../guards/UserInNeighborhood.guard';
import { UserInPlanGuard } from '../../guards/UserInPlan.guard';
import { AddPlanAmountBiggerThanRepaidGuard } from '../../guards/AddPlanAmountBiggerThanRepaid.guard';
import { UserIsPlanAuthor } from '../../guards/UserIsPlanAuthor.guard';
import { EditPlanDto } from '../../dto/edit-plan.dto';
import { NewPlanAmountBiggerThanRepaidGuard } from '../../guards/NewPlanAmountBiggerThanAlreadyRepaid.guard';
import { ValidNeighborhoodIdGuard } from '../../guards/ValidNeighborhoodId.guard';
import { ValidParticipantIdGuard } from '../../guards/ValidParticipantId.guard';

@Controller(ROUTES.PLAN.DEFAULT)
export class PlanController {
  constructor(private planService: PlanService) {}

  @Post(ROUTES.PLAN.CREATE)
  @UseGuards(JwtAuthGuard, UserInNeighborhoodGuard)
  createPlan(@Req() req: Request, @Body() dto: CreatePlanDto) {
    return this.planService.createPlan(req, dto);
  }

  @Get(ROUTES.PLAN.GET_USER_PLANS)
  @UseGuards(JwtAuthGuard)
  getUserPlans(@Req() req: Request) {
    return this.planService.getUserPlans(req);
  }

  @Get(ROUTES.PLAN.GET_USER_PLANS_BY_ID)
  @UseGuards(JwtAuthGuard, ValidNeighborhoodIdGuard, UserInNeighborhoodGuard)
  getUserPlansById(@Req() req: Request, @Query() query) {
    return this.planService.getUserPlansById(req, query.neighborhood_id);
  }

  @Put(ROUTES.PLAN.CHANGE_TASK_STATUS)
  @UseGuards(JwtAuthGuard, UserInPlanGuard)
  changeTaskStatus(@Query() query, @Req() req: Request) {
    return this.planService.changeTaskStatus(query.plan_id, query.task_id, req);
  }

  @Put(ROUTES.PLAN.ADD_PAYMENT)
  @UseGuards(JwtAuthGuard, UserInPlanGuard, AddPlanAmountBiggerThanRepaidGuard)
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
  @UseGuards(JwtAuthGuard, UserIsPlanAuthor)
  closePlan(@Query() query) {
    return this.planService.closePlan(query.plan_id);
  }

  @Put(ROUTES.PLAN.REOPEN_PLAN)
  @UseGuards(JwtAuthGuard, UserIsPlanAuthor)
  reopenPlan(@Query() query) {
    return this.planService.reopenPlan(query.plan_id);
  }

  @Delete(ROUTES.PLAN.DELETE)
  @UseGuards(JwtAuthGuard, UserIsPlanAuthor)
  deletePlan(@Query() query) {
    return this.planService.deletePlan(query.plan_id);
  }

  @Put(ROUTES.PLAN.EDIT)
  @UseGuards(JwtAuthGuard, UserIsPlanAuthor, NewPlanAmountBiggerThanRepaidGuard)
  editDebt(@Req() request: Request, @Body() dto: EditPlanDto, @Query() query) {
    return this.planService.editPlan(dto, query.plan_id);
  }

  @Put(ROUTES.PLAN.ADD_PARTICIPANT)
  @UseGuards(JwtAuthGuard, UserIsPlanAuthor, ValidParticipantIdGuard)
  addParticipant(@Query() query) {
    return this.planService.addParticipant(query.plan_id, query.participant_id);
  }

  @Put(ROUTES.PLAN.REMOVE_PARTICIPANT)
  @UseGuards(JwtAuthGuard, UserIsPlanAuthor, ValidParticipantIdGuard)
  removeParticipant(@Query() query) {
    return this.planService.removeParticipant(
      query.plan_id,
      query.participant_id,
    );
  }
}
