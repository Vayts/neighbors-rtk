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
import { PlanModule } from '../plan/plan.module';
import { DebtModule } from '../debt/debt.module';
import { DutyModule } from '../duty/duty.module';

@Global()
@Module({
  providers: [NeighborhoodService],
  controllers: [NeighborhoodController],
  imports: [
    MongooseModule.forFeature([
      { name: Neighborhood.name, schema: NeighborhoodSchema },
      { name: Neighborhood_User.name, schema: Neighborhood_UserSchema },
      { name: Neighborhood_Invite.name, schema: Neighborhood_InviteSchema },
    ]),
    DebtModule,
    PlanModule,
    DutyModule,
  ],
  exports: [NeighborhoodService],
})
export class NeighborhoodModule {}
