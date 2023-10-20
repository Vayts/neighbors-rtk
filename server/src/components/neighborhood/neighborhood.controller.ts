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
import { NeighborhoodService } from './neighborhood.service';
import { ROUTES } from '../../constants/routes';
import { JwtAuthGuard } from '../../guards/JwtAuth.guard';
import { CreateNeighborhoodDto } from '../../dto/create-neighborhood.dto';
import { InviteCodeExistAndNotExpiredGuard } from '../../guards/InviteCodeExistAndNotExpired.guard';
import { AlreadyInNeighborhoodGuard } from '../../guards/AlreadyInNeighborhood.guard';
import { UserInNeighborhoodGuard } from '../../guards/UserInNeighborhood.guard';
import { UserIsNeighborhoodAdminGuard } from '../../guards/UserIsNeighborhoodAdmin.guard';
import { ValidNeighborhoodIdGuard } from '../../guards/ValidNeighborhoodId.guard';
import { NeighborhoodExistGuard } from '../../guards/NeighborhoodExist.guard';
import { UserIsNotNeighborhoodAdminGuard } from '../../guards/UserIsNotNeighborhoodAdmin.guard';

@Controller(ROUTES.NEIGHBORHOOD.DEFAULT)
export class NeighborhoodController {
  constructor(private neighborhoodService: NeighborhoodService) {}

  @Post(ROUTES.NEIGHBORHOOD.CREATE)
  @UseGuards(JwtAuthGuard)
  createNeighborhood(
    @Req() request: Request,
    @Body() dto: CreateNeighborhoodDto,
  ) {
    return this.neighborhoodService.createNeighborhood(request, dto);
  }

  @Put(ROUTES.NEIGHBORHOOD.EDIT)
  @UseGuards(JwtAuthGuard, UserIsNeighborhoodAdminGuard)
  editNeighborhood(@Query() query, @Body() dto: CreateNeighborhoodDto) {
    return this.neighborhoodService.editNeighborhood(
      query.neighborhood_id,
      dto,
    );
  }

  @Get(ROUTES.NEIGHBORHOOD.GET_BY_CODE)
  @UseGuards(JwtAuthGuard, InviteCodeExistAndNotExpiredGuard)
  getNeighborhoodByInviteCode(@Query() query) {
    return this.neighborhoodService.getNeighborhoodByInviteCode(query.code);
  }

  @Get(ROUTES.NEIGHBORHOOD.JOIN_BY_CODE)
  @UseGuards(
    JwtAuthGuard,
    InviteCodeExistAndNotExpiredGuard,
    AlreadyInNeighborhoodGuard,
  )
  joinNeighborhoodByInviteCode(@Query() query, @Req() req) {
    return this.neighborhoodService.joinNeighborhoodByInviteCode(
      req,
      query.code,
    );
  }

  @Get(ROUTES.NEIGHBORHOOD.GET_USER_NEIGHBORHOODS)
  @UseGuards(JwtAuthGuard)
  getUserNeighborhoods(@Req() req) {
    return this.neighborhoodService.getUserNeighborhoods(req.user._id);
  }

  @Get(ROUTES.NEIGHBORHOOD.GET_CURRENT)
  @UseGuards(JwtAuthGuard, NeighborhoodExistGuard, UserInNeighborhoodGuard)
  getCurrentNeighborhood(@Query() query, @Req() req) {
    return this.neighborhoodService.getCurrentNeighborhood(
      query.neighborhood_id,
      req,
    );
  }

  @Put(ROUTES.NEIGHBORHOOD.SET_FAVORITE)
  @UseGuards(JwtAuthGuard, UserInNeighborhoodGuard)
  setNeighborhoodFavorite(@Query() query, @Req() req) {
    return this.neighborhoodService.setFavorite(
      req.user._id,
      query.neighborhood_id,
    );
  }

  @Put(ROUTES.NEIGHBORHOOD.REMOVE_FAVORITE)
  @UseGuards(JwtAuthGuard, UserInNeighborhoodGuard)
  removeNeighborhoodFavorite(@Query() query, @Req() req) {
    return this.neighborhoodService.removeFavorite(
      req.user._id,
      query.neighborhood_id,
    );
  }

  @Put(ROUTES.NEIGHBORHOOD.REMOVE_USER)
  @UseGuards(JwtAuthGuard, UserIsNeighborhoodAdminGuard)
  removeUserFromNeighborhood(@Query() query) {
    return this.neighborhoodService.removeUser(
      query.user_id,
      query.neighborhood_id,
    );
  }

  @Put(ROUTES.NEIGHBORHOOD.LEAVE_NEIGHBORHOOD)
  @UseGuards(JwtAuthGuard, UserIsNotNeighborhoodAdminGuard)
  leaveFromNeighborhood(@Req() req, @Query() query) {
    return this.neighborhoodService.removeUser(
      req.user._id,
      query.neighborhood_id,
    );
  }

  @Post(ROUTES.NEIGHBORHOOD.GENERATE_INVITE_CODE)
  @UseGuards(
    JwtAuthGuard,
    ValidNeighborhoodIdGuard,
    UserIsNeighborhoodAdminGuard,
  )
  generateInviteCode(@Query() query) {
    return this.neighborhoodService.generateInviteCode(query.neighborhood_id);
  }

  @Delete(ROUTES.NEIGHBORHOOD.REMOVE_INVITE_CODE)
  @UseGuards(
    JwtAuthGuard,
    ValidNeighborhoodIdGuard,
    UserIsNeighborhoodAdminGuard,
  )
  deleteInviteCode(@Query() query) {
    return this.neighborhoodService.removeInviteCode(query.neighborhood_id);
  }

  @Delete(ROUTES.NEIGHBORHOOD.DELETE)
  @UseGuards(
    JwtAuthGuard,
    ValidNeighborhoodIdGuard,
    UserIsNeighborhoodAdminGuard,
  )
  deleteNeighborhood(@Query() query) {
    return this.neighborhoodService.deleteNeighborhood(query.neighborhood_id);
  }
}
