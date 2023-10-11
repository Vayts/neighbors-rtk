import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NeighborhoodService } from './neighborhood.service';
import { ROUTES } from '../../constants/routes';
import { FormDataRequest } from 'nestjs-form-data';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';
import { CreateNeighborhoodDto } from '../../dto/create-neighborhood.dto';
import { InviteCodeExistAndNotExpiredGuard } from '../../guards/inviteCodeExistAndNotExpired.guard';
import { AlreadyInNeighborhoodGuard } from '../../guards/alreadyInNeighborhood.guard';
import { userInNeighborhoodGuard } from '../../guards/userInNeighborhood.guard';

@Controller(ROUTES.NEIGHBORHOOD.DEFAULT)
export class NeighborhoodController {
  constructor(private neighborhoodService: NeighborhoodService) {}

  @Post(ROUTES.NEIGHBORHOOD.CREATE)
  @UseGuards(JwtAuthGuard)
  @FormDataRequest()
  createNeighborhood(
    @Req() request: Request,
    @Body() dto: CreateNeighborhoodDto,
  ) {
    return this.neighborhoodService.createNeighborhood(request, dto);
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
  @UseGuards(JwtAuthGuard, userInNeighborhoodGuard)
  getCurrentNeighborhood(@Query() query, @Req() req) {
    return this.neighborhoodService.getCurrentNeighborhood(
      query.neighborhood_id,
      req,
    );
  }

  @Put(ROUTES.NEIGHBORHOOD.SET_FAVORITE)
  @UseGuards(JwtAuthGuard, userInNeighborhoodGuard)
  setNeighborhoodFavorite(@Query() query, @Req() req) {
    return this.neighborhoodService.setFavorite(
      req.user._id,
      query.neighborhood_id,
    );
  }

  @Put(ROUTES.NEIGHBORHOOD.REMOVE_FAVORITE)
  @UseGuards(JwtAuthGuard, userInNeighborhoodGuard)
  removeNeighborhoodFavorite(@Query() query, @Req() req) {
    return this.neighborhoodService.removeFavorite(
      req.user._id,
      query.neighborhood_id,
    );
  }
}
