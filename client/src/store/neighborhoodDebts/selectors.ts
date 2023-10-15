import { RootState } from '@src/store';
import { neighborhoodsAdapter } from '@src/store/neighborhoodDebts/slice';

export const {
  selectAll: selectAllNeighborhood,
} = neighborhoodsAdapter.getSelectors((state: RootState) => state.neighborhoods);
