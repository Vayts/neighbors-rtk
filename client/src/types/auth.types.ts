import { ErrorType } from '@src/types/default.types';

export interface IRegister {
  firstName: string,
  lastName: string,
  login: string,
  password: string,
  errors: ErrorType,
}

export interface ILogin {
  login: string,
  password: string,
  errors: ErrorType,
}

export interface IEditProfile {
  firstName: string,
  lastName: string,
  avatar: string,
  errors: ErrorType,
}

export interface IChangePassword {
  currentPassword: string,
  password: string,
  confirmPassword: string,
  errors: ErrorType,
}
