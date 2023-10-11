import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Neighborhood } from './neighborhood.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  _id?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author_id: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Neighborhood' })
  chat_id: Neighborhood;

  @Prop()
  seenBy: string[];

  @Prop()
  text: string;

  @Prop()
  sentAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
