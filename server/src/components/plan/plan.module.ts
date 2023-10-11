import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanService } from './plan.service';
import { TokenModule } from '../token/token.module';
import { JwtModule } from '@nestjs/jwt';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PlanController } from './plan.controller';
import { NeighborhoodService } from '../neighborhood/neighborhood.service';
import {
  Neighborhood,
  NeighborhoodSchema,
} from '../../schemas/neighborhood.schema';
import {
  Neighborhood_User,
  Neighborhood_UserSchema,
} from '../../schemas/neighborhood_user.schema';
import { Plan, PlanSchema } from '../../schemas/plan.schema';
import { Debt, DebtSchema } from '../../schemas/debt.schema';
import { DebtService } from '../debt/debt.service';
import {
  Neighborhood_Invite,
  Neighborhood_InviteSchema,
} from '../../schemas/neighborhood_invite.schema';

@Module({
  providers: [PlanService, DebtService, NeighborhoodService],
  controllers: [PlanController],
  imports: [
    MongooseModule.forFeature([
      { name: Debt.name, schema: DebtSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: Neighborhood.name, schema: NeighborhoodSchema },
      { name: Neighborhood_User.name, schema: Neighborhood_UserSchema },
      { name: Neighborhood_Invite.name, schema: Neighborhood_InviteSchema },
    ]),
    JwtModule.register({}),
    NestjsFormDataModule,
    TokenModule,
  ],
  exports: [JwtModule],
})
export class PlanModule {}
