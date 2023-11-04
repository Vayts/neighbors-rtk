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
import { ROUTES } from '../../constants/routes';
import { JwtAuthGuard } from '../../guards/JwtAuth.guard';
import { DutyService } from './duty.service';
import { CreateDutyDto } from '../../dto/create-duty.dto';
import { ValidNeighborhoodIdGuard } from '../../guards/ValidNeighborhoodId.guard';
import { UserInDutyGuard } from '../../guards/UserInDuty.guard';
import { ValidDutyIdGuard } from '../../guards/ValidDutyId.guard';
import { AddMarkDto } from '../../dto/add-mark.dto';
import { DutyMarkAlreadyExist } from '../../guards/DateMarkAlreadyExist.guard';
import { UserIsMarkAuthorGuard } from '../../guards/UserIsMarkAuthor.guard';
import { ValidMarkIdGuard } from '../../guards/ValidMarkId.guard';
import { UserIsDutyAuthorGuard } from '../../guards/UserIsDutyAuthor.guard';
import { EditDutyDto } from '../../dto/edit-duty.dto';
import { ValidParticipantIdGuard } from '../../guards/ValidParticipantId.guard';

@Controller(ROUTES.DUTY.DEFAULT)
export class DutyController {
  constructor(private dutyService: DutyService) {}

  @Post(ROUTES.DUTY.CREATE)
  @UseGuards(JwtAuthGuard)
  create(@Req() request: Request, @Body() dto: CreateDutyDto) {
    return this.dutyService.create(request, dto);
  }

  @Put(ROUTES.DUTY.EDIT)
  @UseGuards(JwtAuthGuard, ValidDutyIdGuard, UserIsDutyAuthorGuard)
  edit(@Body() dto: EditDutyDto, @Query() query) {
    return this.dutyService.edit(dto, query.duty_id);
  }

  @Post(ROUTES.DUTY.ADD_MARK)
  @UseGuards(
    JwtAuthGuard,
    ValidDutyIdGuard,
    ValidNeighborhoodIdGuard,
    DutyMarkAlreadyExist,
    UserInDutyGuard,
  )
  addMark(@Req() request: Request, @Query() query, @Body() dto: AddMarkDto) {
    return this.dutyService.addMark(request, query, dto.date);
  }

  @Delete(ROUTES.DUTY.DELETE)
  @UseGuards(JwtAuthGuard, ValidDutyIdGuard, UserIsDutyAuthorGuard)
  deleteDuty(@Req() request: Request, @Query() query) {
    return this.dutyService.delete(request, query.duty_id);
  }

  @Delete(ROUTES.DUTY.DELETE_MARK)
  @UseGuards(JwtAuthGuard, ValidMarkIdGuard, UserIsMarkAuthorGuard)
  deleteMark(@Req() request: Request, @Query() query) {
    return this.dutyService.deleteMark(request, query.mark_id);
  }

  @Get(ROUTES.DUTY.GET_USER_DUTIES_BY_ID)
  @UseGuards(JwtAuthGuard, ValidNeighborhoodIdGuard)
  getByNeighborhoodId(@Req() request: Request, @Query() query) {
    return this.dutyService.getByNeighborhoodId(request, query.neighborhood_id);
  }

  @Get(ROUTES.DUTY.GET_USER_DUTIES)
  @UseGuards(JwtAuthGuard)
  getAll(@Req() request: Request) {
    return this.dutyService.getAll(request);
  }

  @Put(ROUTES.DUTY.ADD_PARTICIPANT)
  @UseGuards(JwtAuthGuard, UserIsDutyAuthorGuard, ValidParticipantIdGuard)
  addParticipant(@Query() query) {
    return this.dutyService.addParticipant(query.duty_id, query.participant_id);
  }

  @Put(ROUTES.DUTY.REMOVE_PARTICIPANT)
  @UseGuards(JwtAuthGuard, UserIsDutyAuthorGuard, ValidParticipantIdGuard)
  removeParticipant(@Query() query) {
    return this.dutyService.removeParticipant(
      query.duty_id,
      query.participant_id,
    );
  }
}
