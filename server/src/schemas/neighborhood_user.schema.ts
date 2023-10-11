import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Neighborhood } from './neighborhood.schema';

export type Neighborhood_UserDocument = HydratedDocument<Neighborhood_User>;

@Schema()
export class Neighborhood_User {
  _id?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: User;

  @Prop()
  role: string;

  @Prop({ default: false })
  isFavorite: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Neighborhood' })
  neighborhood_id: Neighborhood;
}

export const Neighborhood_UserSchema =
  SchemaFactory.createForClass(Neighborhood_User);
