import { ICurrentNeighborhood } from '@src/types/neighborhood.types';

export interface ICurrentNeighborhoodState {
  isLoading: boolean,
  neighborhood: ICurrentNeighborhood,
}
