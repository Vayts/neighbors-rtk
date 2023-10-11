import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNeighborhoodDto {
  @IsString({ message: 'Must be a string' })
  @MinLength(4)
  @MaxLength(30)
  readonly name: string;
  @MinLength(2)
  @MaxLength(400)
  @IsString({ message: 'Must be a string' })
  readonly description: string;
  @IsString({ message: 'Must be a string' })
  readonly currency: string;
}
