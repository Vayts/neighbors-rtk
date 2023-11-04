import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Neighborhood } from './neighborhood.schema';
import { PlanParticipantPaymentSchema } from './planParticipant.schema';
import { PlanTaskSchema, PlanTaskSchemaDocument } from './planTask.schema';

export type PlanDocument = HydratedDocument<Plan>;

@Schema()
export class Plan {
  _id?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author_id: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Neighborhood' })
  neighborhood_id: Neighborhood;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ default: false })
  isPaymentRequired: boolean;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  participants: mongoose.Schema.Types.ObjectId[];

  @Prop()
  participantPayments: [PlanParticipantPaymentSchema];

  @Prop({ default: false })
  isTaskListRequired: boolean;

  @Prop({ type: [PlanTaskSchemaDocument] })
  tasksList: [PlanTaskSchema] | null;

  @Prop({ type: Date, default: null })
  eventDate: Date | null;

  @Prop({ default: null })
  paymentAmount: number | null;

  @Prop({ default: false })
  isClosed: boolean;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
