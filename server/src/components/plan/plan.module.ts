import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { Plan, PlanSchema } from '../../schemas/plan.schema';

@Module({
  providers: [PlanService],
  controllers: [PlanController],
  imports: [
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
  ],
  exports: [PlanService],
})
export class PlanModule {}
