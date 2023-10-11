import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class EditPlanDto {
  @IsString({ message: 'Must be a string' })
  @MinLength(3)
  @MaxLength(25)
  readonly name: string;
  @IsString({ message: 'Must be a string' })
  @MinLength(5)
  @MaxLength(200)
  readonly description: string;
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(9999999)
  readonly paymentAmount: number | null;
  @Transform(({ value }) => {
    return value !== 'null' ? new Date(value) : JSON.parse(value);
  })
  @IsOptional()
  readonly dueDate: number | null;
}
