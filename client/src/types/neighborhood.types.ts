import { CurrencyType, ErrorType } from '@src/types/default.types';
import { IMember } from '@src/types/user.types';

export interface ICreateNeighborhood {
  name: string,
  description: string,
  errors: ErrorType,
  currency: CurrencyType | '',
}

export interface INeighborhood {
  _id: string,
  name: string,
  role: NeighborhoodRoleEnum,
  isFavorite: boolean,
  description: string,
  avatar: string | null,
  currency: CurrencyType,
  members: IMember[],
}

export enum NeighborhoodRoleEnum {
  admin = 'admin',
  member = 'member',
}
