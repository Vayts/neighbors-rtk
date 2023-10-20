import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Neighborhood } from './neighborhood.schema';
import { EventTypeEnum } from '../types/event.types';

export type Neighborhood_EventDocument = HydratedDocument<Neighborhood_Event>;

@Schema()
export class Neighborhood_Event {
  _id?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author_id: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Neighborhood' })
  neighborhood_id: Neighborhood;

  @Prop({ type: String, enum: EventTypeEnum })
  type: EventTypeEnum;

  @Prop()
  recipients: mongoose.Schema.Types.Mixed;

  @Prop({ default: null })
  link: string;

  @Prop()
  createdAt: Date;
}

export const Neighborhood_EventSchema =
  SchemaFactory.createForClass(Neighborhood_Event);
