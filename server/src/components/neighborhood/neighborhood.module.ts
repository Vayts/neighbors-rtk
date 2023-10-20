import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NeighborhoodService } from './neighborhood.service';
import { NeighborhoodController } from './neighborhood.controller';
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
import { DebtService } from '../debt/debt.service';
import { Debt, DebtSchema } from '../../schemas/debt.schema';
import { Plan, PlanSchema } from '../../schemas/plan.schema';
import { PlanModule } from '../plan/plan.module';
import { EventModule } from '../event/event.module';

@Global()
@Module({
  providers: [NeighborhoodService, DebtService],
  controllers: [NeighborhoodController],
  imports: [
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema },
      { name: Debt.name, schema: DebtSchema },
      { name: Neighborhood.name, schema: NeighborhoodSchema },
      { name: Neighborhood_User.name, schema: Neighborhood_UserSchema },
      { name: Neighborhood_Invite.name, schema: Neighborhood_InviteSchema },
    ]),
    PlanModule,
    EventModule,
  ],
  exports: [NeighborhoodService],
})
export class NeighborhoodModule {}
