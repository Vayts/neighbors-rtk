import { CurrencyType, ErrorType } from '@src/types/default.types';
import { EntityId } from '@reduxjs/toolkit';

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
  inviteCode: null | string,
  events: INeighborhoodEvent[],
}

export interface INeighborhoodEvent {
  author: EntityId,
  eventType: INeighborhoodEventEnum,
  createdAt: Date,
}

export enum INeighborhoodEventEnum {
  JoinNeighborhood = 'joinNeighborhood',
  LeaveNeighborhood = 'leaveNeighborhood',
  NewDebt = 'newDebt',
  NewPlan = 'newPlan',
}

export enum NeighborhoodRoleEnum {
  admin = 'admin',
  member = 'member',
}
