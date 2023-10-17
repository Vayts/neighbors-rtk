import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ROUTES } from '../../constants/routes';
import { UserService } from './user.service';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';

@Controller(ROUTES.USER.DEFAULT)
export class UserController {
  constructor(private userService: UserService) {}

  @Put(ROUTES.USER.EDIT)
  @UseGuards(JwtAuthGuard)
  editProfile(@Req() request: Request, @Body() dto: UpdateUserDto) {
    return this.userService.updateUserInfo(request, dto);
  }
}
