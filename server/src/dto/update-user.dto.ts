import { IsIn, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { AVATARS } from '../constants/app.constants';

export class UpdateUserDto {
  @Transform(({ value }) => {
    return value.trim();
  })
  @IsString({ message: 'Must be a string' })
  @Length(2, 25)
  readonly firstName: string;
  @Transform(({ value }) => {
    return value.trim();
  })
  @IsString({ message: 'Must be a string' })
  @Length(2, 20)
  readonly lastName: string;
  @Transform(({ value }) => {
    return value.trim();
  })
  @IsString({ message: 'Must be a string' })
  @IsString({ message: 'Must be a string' })
  @IsIn(AVATARS)
  readonly avatar: string;
}
