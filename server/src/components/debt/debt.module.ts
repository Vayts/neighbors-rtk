import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DebtService } from './debt.service';
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
import { EventService } from '../event/event.service';
import {
  Neighborhood_Event,
  Neighborhood_EventSchema,
} from '../../schemas/neighborhood_event.schema';
import { NeighborhoodModule } from '../neighborhood/neighborhood.module';

@Global()
@Module({
  providers: [DebtService, NeighborhoodService, PlanService, EventService],
  controllers: [DebtController],
  imports: [
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema },
      { name: Debt.name, schema: DebtSchema },
      { name: Neighborhood.name, schema: NeighborhoodSchema },
      { name: Neighborhood_Event.name, schema: Neighborhood_EventSchema },
      { name: Neighborhood_User.name, schema: Neighborhood_UserSchema },
      { name: Neighborhood_Invite.name, schema: Neighborhood_InviteSchema },
    ]),
    NeighborhoodModule,
  ],
  exports: [DebtService],
})
export class DebtModule {}
