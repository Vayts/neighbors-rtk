import { ErrorType } from '@src/types/default.types';
import { EntityId } from '@reduxjs/toolkit';

export interface ICreateDuty {
  neighborhood_id: string,
  name: string,
  participants: string[],
  isAllMembersInvited: boolean,
  errors: ErrorType,
}

export interface IEditDuty {
  name: string,
  errors: ErrorType,
}

export interface ICreateDutyDto {
  neighborhood_id: string,
  name: string,
  participants: EntityId[],
  isAllMembersInvited: boolean,
}

export interface IEditDutyDto {
  name: string,
}

export interface IDuty {
  _id: string,
  author: EntityId,
  neighborhood: EntityId,
  name: string,
  description: string,
  participants: EntityId[],
  createdAt: Date,
  dutyMarks: IDutyMark[],
}

export interface IDutyMark {
  _id: string,
  author_id: EntityId,
  duty: EntityId,
  date: Date,
  createdAt: Date,
}
