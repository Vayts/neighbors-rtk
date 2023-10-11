import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DebtService } from './debt.service';
import { TokenModule } from '../token/token.module';
import { JwtModule } from '@nestjs/jwt';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { DebtController } from './debt.controller';
import { NeighborhoodService } from '../neighborhood/neighborhood.service';
import { Debt, DebtSchema } from '../../schemas/debt.schema';
import {
  Neighborhood,
  NeighborhoodSchema,
} from '../../schemas/neighborhood.schema';
import {
  Neighborhood_User,
  Neighborhood_UserSchema,
} from '../../schemas/neighborhood_user.schema';
import {
  Neighborhood_Invite,
  Neighborhood_InviteSchema,
} from '../../schemas/neighborhood_invite.schema';
import { PlanService } from '../plan/plan.service';
import { Plan, PlanSchema } from '../../schemas/plan.schema';

@Module({
  providers: [DebtService, NeighborhoodService, PlanService],
  controllers: [DebtController],
  imports: [
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema },
      { name: Debt.name, schema: DebtSchema },
      { name: Neighborhood.name, schema: NeighborhoodSchema },
      { name: Neighborhood_User.name, schema: Neighborhood_UserSchema },
      { name: Neighborhood_Invite.name, schema: Neighborhood_InviteSchema },
    ]),
    JwtModule.register({}),
    NestjsFormDataModule,
    TokenModule,
  ],
  exports: [JwtModule, DebtService],
})
export class DebtModule {}
