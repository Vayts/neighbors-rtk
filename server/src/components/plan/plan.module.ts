import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import {
  Neighborhood,
  NeighborhoodSchema,
} from '../../schemas/neighborhood.schema';
import {
  Neighborhood_User,
  Neighborhood_UserSchema,
} from '../../schemas/neighborhood_user.schema';
import { Plan, PlanSchema } from '../../schemas/plan.schema';

import {
  Neighborhood_Invite,
  Neighborhood_InviteSchema,
} from '../../schemas/neighborhood_invite.schema';
import { EventModule } from '../event/event.module';
import { NeighborhoodService } from '../neighborhood/neighborhood.service';

@Module({
  providers: [PlanService, NeighborhoodService],
  controllers: [PlanController],
  imports: [
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema },
      { name: Neighborhood.name, schema: NeighborhoodSchema },
      { name: Neighborhood_User.name, schema: Neighborhood_UserSchema },
      { name: Neighborhood_Invite.name, schema: Neighborhood_InviteSchema },
    ]),
    EventModule,
  ],
  exports: [PlanService],
})
export class PlanModule {}
