import { IsString, MaxLength, MinLength } from 'class-validator';

export class EditDutyDto {
  @IsString({ message: 'Must be a string' })
  @MinLength(2)
  @MaxLength(25)
  readonly name: string;
}
