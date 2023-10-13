import { RootState } from '@src/store';
import { plansAdapter } from '@src/store/plans/slice';

export const {
  selectAll: selectAllPlans,
} = plansAdapter.getSelectors((state: RootState) => state.plans);
