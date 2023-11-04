import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Neighborhood } from './neighborhood.schema';

export type Duty_MarkDocument = HydratedDocument<Duty_Mark>;

@Schema()
export class Duty_Mark {
  _id?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author_id: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Neighborhood' })
  neighborhood_id: Neighborhood;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Duty' })
  duty_id: User;

  @Prop({ type: Date })
  date: Date;

  @Prop({ type: Date })
  createdAt: Date;
}

export const Duty_MarkSchema = SchemaFactory.createForClass(Duty_Mark);
