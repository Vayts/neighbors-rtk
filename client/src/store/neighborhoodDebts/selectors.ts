import { RootState } from '@src/store';
import { neighborhoodDebtsAdapter } from '@src/store/neighborhoodDebts/slice';

export const {
  selectAll: selectAllNeighborhoodDebts,
} = neighborhoodDebtsAdapter.getSelectors((state: RootState) => state.neighborhoodDebts);
