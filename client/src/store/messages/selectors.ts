import { RootState } from '@src/store';
import { createSelector } from 'reselect';
import { IMessage } from '@src/types/chat.types';

const messages = (state: RootState) => state.messages;

export const selectMessagesByIds = createSelector(
  [
    messages,
    (state, ids) => ids,
  ],
  (state, ids): IMessage[] => {
    return ids.map((item: string) => state.entities[item]);
  },
);
