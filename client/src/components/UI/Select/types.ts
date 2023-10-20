import { ChangeEvent } from 'react';
import DefaultTFuncReturn from 'i18next';

export interface ISelectProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  name: string,
  error?: string,
  isInvalid?: boolean,
  value: string,
  valuesArr: string[] | ISelectValue[],
  placeholder?: string | typeof DefaultTFuncReturn,
  label?: string | typeof DefaultTFuncReturn,
  clearable?: boolean,
  disabled?: boolean,
}

export interface ISelectValue {
  value: string,
  text: string,
}
