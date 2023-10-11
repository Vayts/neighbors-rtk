import { CurrencyType, ErrorType } from '@src/types/default.types';
import { IUser } from '@src/types/user.types';
import { INeighborhood } from '@src/types/neighborhood.types';

export interface ICreateDebt {
  text: string,
  debtor_id: string,
  neighborhood_id: string,
  debtAmount: string,
  dueDate: Date | null,
  errors: ErrorType,
}

export interface IEditDebt {
  text: string,
  debtAmount: string,
  dueDate: Date | null,
  errors: ErrorType,
}

export interface IEditDebtDto {
  text: string,
  debtAmount: string,
  dueDate: string | null,
}

export interface ICreateDebtDto {
  text: string,
  debtor_id: string,
  neighborhood_id: string,
  debtAmount: string,
  dueDate: string | null,
  [key: string]: string |null;
}

export interface IDebt {
  _id: string,
  neighborhood: INeighborhood,
  text: string,
  author: IUser,
  debtor: IUser,
  createdAt: Date;
  repaidAmount: number,
  debtAmount: number,
  dueDate: Date | null,
}

export interface IDebtTopItem {
  neighborhoodTitle: string,
  neighborhood_id: string,
  avatar: string,
  amount: number,
  currency: CurrencyType,
  userFullName: string,
  user_id: string,
}

export enum DebtsFilterEnum {
  all = 'all',
  active = 'active',
  closed = 'closed',
  overdue = 'overdue',
  myDebts = 'myDebts',
  myDebtors = 'myDebtors',
}
