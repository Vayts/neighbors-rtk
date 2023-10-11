import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Must be a string' })
  readonly firstName: string;
  @IsString({ message: 'Must be a string' })
  readonly lastName: string;
  @IsString({ message: 'Must be a string' })
  readonly login: string;
  @Length(8, 25, {
    message: 'Password must be at least 8 characters and less than 25 ',
  })
  readonly password: string;
}
