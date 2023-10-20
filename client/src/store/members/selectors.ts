import { RootState } from '@src/store';
import { createSelector } from 'reselect';

const members = (state: RootState) => state.members;

export const selectMembersByIds = createSelector(
  [
    members,
    (state, ids) => ids,
  ],
  (state, ids) => {
    return ids.map((item: string) => state.entities[item]);
  },
);
