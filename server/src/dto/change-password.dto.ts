import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'Must be a string' })
  readonly currentPassword: string;
  @Length(8, 25, {
    message: 'Password must be at least 8 characters and less than 25 ',
  })
  @IsString({ message: 'Must be a string' })
  readonly password: string;
  @Length(8, 25, {
    message: 'Password must be at least 8 characters and less than 25 ',
  })
  @IsString({ message: 'Must be a string' })
  readonly confirmPassword: string;
}
