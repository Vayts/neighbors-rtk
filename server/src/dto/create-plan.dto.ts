import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PLAN_ERRORS } from '../constants/errors';
import mongoose from 'mongoose';

export class CreatePlanDto {
  @IsString({ message: 'Must be a string' })
  @MinLength(3)
  @MaxLength(25)
  readonly name: string;
  @IsString({ message: 'Must be a string' })
  @MinLength(5)
  @MaxLength(200)
  readonly description: string;
  @IsString({ message: 'Must be a string' })
  readonly neighborhood_id: string;
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : null))
  @Min(0.1)
  @Max(9999999)
  readonly paymentAmount: number | null;
  @Transform(({ value }) => {
    return value ? new Date(value) : value;
  })
  @IsOptional()
  readonly eventDate: number | null;

  @IsBoolean()
  readonly isPaymentRequired: boolean;

  @IsBoolean()
  readonly isTasksListRequired: boolean;

  @IsArray()
  @Transform(({ value }) =>
    value.map((item) => new mongoose.Types.ObjectId(item)),
  )
  @ArrayNotEmpty({ message: PLAN_ERRORS.NOT_ENOUGH_PARTICIPANTS })
  readonly participants: string[];

  @IsOptional()
  @Transform(({ value }) =>
    value
      ? value.map((item) => {
          return {
            text: item,
            completedAt: null,
            completedBy: null,
            completed: false,
          };
        })
      : null,
  )
  @IsArray()
  readonly tasksList: string[];
}
