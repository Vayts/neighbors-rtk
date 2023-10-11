import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id?: string;

  @Prop()
  fullName: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ default: null })
  avatar: string | null;

  @Prop()
  login: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
