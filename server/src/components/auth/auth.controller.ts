import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginUserDto } from '../../dto/login-user.dto';
import { AuthService } from './auth.service';
import { ROUTES } from '../../constants/routes';
import { CreateUserDto } from '../../dto/create-user.dto';

@Controller(ROUTES.AUTH.DEFAULT)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(ROUTES.AUTH.LOGIN)
  login(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: LoginUserDto,
  ) {
    return this.authService.login(response, dto);
  }

  @Post(ROUTES.AUTH.REGISTER)
  register(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: CreateUserDto,
  ) {
    return this.authService.register(response, dto);
  }

  @Get(ROUTES.AUTH.REFRESH)
  refresh(@Req() request: Request) {
    return this.authService.refresh(request);
  }

  @Get(ROUTES.AUTH.LOGOUT)
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(request, response);
  }
}
