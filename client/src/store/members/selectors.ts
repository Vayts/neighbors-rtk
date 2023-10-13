import { RootState } from '@src/store';
import { membersAdapter } from '@src/store/members/slice';

export const {
  selectAll: selectAllMembers,
} = membersAdapter.getSelectors((state: RootState) => state.members);
