import { RootState } from '@src/store';
import { debtsAdapter } from '@src/store/debts/slice';

export const {
  selectAll: selectAllDebts,
} = debtsAdapter.getSelectors((state: RootState) => state.debts);
