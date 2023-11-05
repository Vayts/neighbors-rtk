import { CurrencyType, ErrorType } from '@src/types/default.types';
import { EntityId } from '@reduxjs/toolkit';
import { INeighborhoodEvent } from '@src/types/event.types';

export interface ICreateNeighborhood {
  name: string,
  description: string,
  errors: ErrorType,
  currency: CurrencyType | '',
}

export interface IEditNeighborhood {
  name: string,
  description: string,
  errors: ErrorType,
  currency: CurrencyType,
}

export interface INeighborhood {
  _id: string,
  name: string,
  role: NeighborhoodRoleEnum,
  isFavorite: boolean,
  description: string,
  avatar: string | null,
  currency: CurrencyType,
  members: EntityId[],
}

export interface ICurrentNeighborhood extends INeighborhood{
  debts: number,
  plans: number,
  duties: number,
  inviteCode: null | string,
  events: INeighborhoodEvent[],
}

export enum NeighborhoodRoleEnum {
  admin = 'admin',
  member = 'member',
}
