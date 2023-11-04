import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DutyService } from './duty.service';
import { Duty, DutySchema } from '../../schemas/duty.schema';
import { Duty_Mark, Duty_MarkSchema } from '../../schemas/duty_mark.schema';
import { DutyController } from './duty.controller';

@Module({
  providers: [DutyService],
  controllers: [DutyController],
  imports: [
    MongooseModule.forFeature([
      { name: Duty.name, schema: DutySchema },
      { name: Duty_Mark.name, schema: Duty_MarkSchema },
    ]),
  ],
  exports: [DutyService],
})
export class DutyModule {}
