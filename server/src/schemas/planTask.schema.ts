import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

@Schema({ _id: true })
export class PlanTaskSchema {
  _id: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  completedBy: User | null;
  @Prop()
  completed: boolean;
  @Prop({ default: null })
  completedAt: Date | null;
  @Prop()
  text: string;
}

export const PlanTaskSchemaDocument =
  SchemaFactory.createForClass(PlanTaskSchema);
