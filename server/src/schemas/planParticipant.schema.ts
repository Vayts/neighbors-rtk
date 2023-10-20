import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

@Schema({ _id: false, versionKey: false })
export class PlanParticipantPaymentSchema {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  participant_id: User;
  @Prop()
  payment: number;
}
