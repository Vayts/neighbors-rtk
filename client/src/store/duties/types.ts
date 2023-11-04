import { EntityId } from '@reduxjs/toolkit';

export interface IDutiesState {
  isLoading: boolean,
  loadingItems: EntityId[],
}
