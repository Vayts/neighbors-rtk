import { ActionCreatorWithPreparedPayload } from '@reduxjs/toolkit';

export interface IDeleteModalProps {
  itemId: string;
  action: ActionCreatorWithPreparedPayload<[any], { [any: string]: any; }, string, never, never>
  text: string,
  onClose: () => void;
}
