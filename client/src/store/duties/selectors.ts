import { RootState } from '@src/store';
import { dutiesAdapter } from '@src/store/duties/slice';

export const {
  selectAll: selectAllDuties,
} = dutiesAdapter.getSelectors((state: RootState) => state.duties);
