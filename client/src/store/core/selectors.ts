import { RootState } from '@src/store';

export const selectAppLoading = (state: RootState): boolean => state.core.isLoading;
