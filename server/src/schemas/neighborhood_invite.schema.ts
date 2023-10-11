import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Neighborhood } from './neighborhood.schema';

export type Neighborhood_InviteDocument = HydratedDocument<Neighborhood_Invite>;

@Schema()
export class Neighborhood_Invite {
  _id?: string;

  @Prop()
  code: string;

  @Prop()
  expirationDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Neighborhood' })
  neighborhood_id: Neighborhood;
}

export const Neighborhood_InviteSchema =
  SchemaFactory.createForClass(Neighborhood_Invite);
