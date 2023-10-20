import { RootState } from '@src/store';
import { neighborhoodsAdapter } from '@src/store/neighborhoods/slice';

export const {
  selectAll: selectAllNeighborhood,
} = neighborhoodsAdapter.getSelectors((state: RootState) => state.neighborhoods);
