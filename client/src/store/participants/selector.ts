import { createSelector } from 'reselect';
import { RootState } from '@src/store';

const participants = (state: RootState) => state.participants;

export const selectParticipantsByIds = createSelector(
  [
    participants,
    (state, ids) => ids,
  ],
  (state, ids) => {
    return ids.map((item: string) => state.entities[item]);
  },
);
