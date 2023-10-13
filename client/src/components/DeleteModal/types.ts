import { ActionCreatorWithPreparedPayload, AsyncThunk } from '@reduxjs/toolkit';

export interface IDeleteModalProps {
  itemId: string;
  action: ActionCreatorWithPreparedPayload<[any], { [any: string]: any; }, string, never, never>
    | AsyncThunk<{ [key: string]: { [key: string]: any; }; }, string, any>
  text: string,
  onClose: () => void;
}
