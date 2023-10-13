import { Ref } from 'react';
import DefaultTFuncReturn from 'i18next';

export interface IDateInputProps {
  onChange: (e: {target: {name: string, value: Date | null}}) => void,
  name: string,
  error?: string,
  isInvalid?: boolean,
  value: Date | null,
  placeholder?: string | typeof DefaultTFuncReturn,
  label?: string | typeof DefaultTFuncReturn,
  refValue?: Ref<HTMLInputElement> | null,
}
