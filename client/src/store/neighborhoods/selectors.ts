import { neighborhoodsAdapter } from '@src/store/neighborhoods/slice';
import { RootState } from '@src/store';

export const {
  selectAll: selectAllNeighborhoods,
} = neighborhoodsAdapter.getSelectors((state: RootState) => state.neighborhoods);
