import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from '../token/token.module';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  providers: [AuthService, UserService],
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
    NestjsFormDataModule,
    TokenModule,
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
