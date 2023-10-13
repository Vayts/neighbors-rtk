import { INeighborhood } from '@src/types/neighborhood.types';

export interface INeighborhoodsState {
  neighborhoodByCode: INeighborhood | null,
  isLoading: boolean,
}
