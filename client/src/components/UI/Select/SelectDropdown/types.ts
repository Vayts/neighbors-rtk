import { ISelectValue } from '@src/components/UI/Select/types';
import React, { RefObject } from 'react';

export interface ISelectDropdownProps {
  valuesArr: string[] | ISelectValue[],
  value: string | ISelectValue,
  onClose: () => void,
  ref: RefObject<HTMLDivElement>,
  onClick: (e: React.MouseEvent<HTMLLIElement>) => void;
}
