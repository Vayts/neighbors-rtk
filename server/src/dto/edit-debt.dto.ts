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

export class EditDebtDto {
  @IsString({ message: 'Must be a string' })
  @MinLength(2)
  @MaxLength(120)
  readonly text: string;
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @Max(9999999)
  readonly debtAmount: number;
  @Transform(({ value }) => {
    return value ? new Date(value) : value;
  })
  @IsOptional()
  readonly dueDate: number | null;
}
