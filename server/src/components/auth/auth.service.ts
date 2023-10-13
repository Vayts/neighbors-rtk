import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserDocument } from '../../schemas/user.schema';
import { TokenService } from '../token/token.service';
import { ERRORS } from '../../constants/errors';
import { SimpleUserDto } from '../../dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { InvalidDataException } from '../../exception/invalidData.exception';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async login(res, dto) {
    const user = await this.validateUser(dto);
    const tokens = this.tokenService.generateTokens(user);
    await this.tokenService.updateToken(user._id, tokens.refresh);
    res.cookie('neighbors_auth', tokens.refresh, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    const userDTO = new SimpleUserDto(user);
    return { ...userDTO, token: tokens.access };
  }

  async validateUser(dto) {
    const user: UserDocument = await this.userService.getUserByLogin(dto.login);
    try {
      const isPasswordCorrect = await bcrypt.compare(
        dto.password,
        user.password,
      );
      if (user && isPasswordCorrect) {
        return user;
      }
    } catch {
      throw new InvalidDataException({ message: ERRORS.WRONG_LOGIN_PASSWORD });
    }
    throw new InvalidDataException({ message: ERRORS.WRONG_LOGIN_PASSWORD });
  }

  async logout(req, res) {
    res.clearCookie('neighbors_auth', {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
  }

  async register(res, candidate) {
    const isExist = await this.userService.getUserByLogin(candidate.login);
    if (isExist)
      throw new HttpException(
        ERRORS.USER_ALREADY_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    const hashPassword = await bcrypt.hash(candidate.password, 10);
    const user: UserDocument[] = await this.userService.createUser({
      ...candidate,
      password: hashPassword,
    });
    const tokens = this.tokenService.generateTokens(user[0]);
    await this.tokenService.setToken(user[0]._id, tokens.refresh);
    res.cookie('neighbors_auth', tokens.refresh, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    const userDTO = new SimpleUserDto(user[0]);
    return { ...userDTO, token: tokens.access };
  }

  async refresh(req) {
    const jwtToken = req.cookies.neighbors_auth;
    if (!jwtToken) return null;
    const tokenCheck = await this.tokenService.getTokenByToken(jwtToken);
    if (!tokenCheck)
      throw new HttpException(
        `${ERRORS.UNDEFINED_TOKEN}`,
        HttpStatus.UNAUTHORIZED,
      );

    try {
      const user: UserDocument | null = this.jwtService.verify(jwtToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh',
      });
      const newTokens = this.tokenService.generateTokens(user);

      if (user._id !== tokenCheck.user_id.toString()) {
        return Promise.reject(`${ERRORS.UNDEFINED_TOKEN}`);
      }

      const userBody = await this.userService.getUserByLogin(user.login);
      const simpleUserBody = new SimpleUserDto(userBody);

      return { ...simpleUserBody, token: newTokens.access };
    } catch (e) {
      if (e.message === 'jwt expired') {
        throw new HttpException(ERRORS.TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(ERRORS.NOT_AUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
  }
}
