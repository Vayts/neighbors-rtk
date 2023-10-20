import { EntityId } from '@reduxjs/toolkit';

export enum EventTypeEnum {
  NewDebt = 'newDebt',
  NewMember = 'newMember',
  NewPlan = 'newPlan',
  UserHasLeft = 'userHasLeft',
}

export interface INeighborhoodEvent {
  _id: string,
  author_id: EntityId,
  author: [EntityId],
  link: null | string,
  createdAt: Date,
  type: EventTypeEnum,
}
