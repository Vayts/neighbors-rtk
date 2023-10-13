import { userNeighborhoodsAdapter } from '@src/store/userNeighborhoods/slice';
import { RootState } from '@src/store';

export const {
  selectAll: selectAllNeighborhoods,
} = userNeighborhoodsAdapter.getSelectors((state: RootState) => state.userNeighborhoods);
