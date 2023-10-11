import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Neighborhood } from './neighborhood.schema';

export type DebtDocument = HydratedDocument<Debt>;

@Schema()
export class Debt {
  _id?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author_id: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  debtor_id: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Neighborhood' })
  neighborhood_id: Neighborhood;

  @Prop()
  text: string;

  @Prop()
  createdAt: Date;

  @Prop({ type: Date, default: null })
  dueDate: Date | null;

  @Prop()
  debtAmount: number;

  @Prop({ default: 0 })
  repaidAmount: number;
}

export const DebtSchema = SchemaFactory.createForClass(Debt);
