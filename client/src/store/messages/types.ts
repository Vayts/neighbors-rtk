import { EntityId } from '@reduxjs/toolkit';

export interface IMessageState {
  isLoading: boolean,
  viewedMessages: EntityId[],
}
