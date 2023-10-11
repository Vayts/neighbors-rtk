import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NeighborhoodDocument = HydratedDocument<Neighborhood>;

@Schema()
export class Neighborhood {
  _id?: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  currency: string;

  @Prop()
  createdAt: Date;

  @Prop({ default: null })
  avatar: string | null;
}

export const NeighborhoodSchema = SchemaFactory.createForClass(Neighborhood);
