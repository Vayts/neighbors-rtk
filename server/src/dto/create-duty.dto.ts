import {
  ArrayNotEmpty,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PLAN_ERRORS } from '../constants/errors';
import mongoose from 'mongoose';

export class CreateDutyDto {
  @IsString({ message: 'Must be a string' })
  @MinLength(2)
  @MaxLength(25)
  readonly name: string;
  @IsString({ message: 'Must be a string' })
  readonly neighborhood_id: string;
  @IsArray()
  @Transform(({ value }) =>
    value.map((item) => new mongoose.Types.ObjectId(item)),
  )
  @ArrayNotEmpty({ message: PLAN_ERRORS.NOT_ENOUGH_PARTICIPANTS })
  readonly participants: string[];
}
