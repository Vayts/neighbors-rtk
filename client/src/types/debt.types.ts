import { ErrorType } from '@src/types/default.types';
import { EntityId } from '@reduxjs/toolkit';

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
  neighborhood: EntityId,
  text: string,
  author: EntityId,
  debtor: EntityId,
  createdAt: Date;
  repaidAmount: number,
  debtAmount: number,
  dueDate: Date | null,
}

export interface IDebtTopItem {
  user: EntityId,
  neighborhood: EntityId,
  amount: number,
}

export enum DebtsFilterEnum {
  all = 'all',
  active = 'active',
  closed = 'closed',
  overdue = 'overdue',
  myDebts = 'myDebts',
  myDebtors = 'myDebtors',
}
