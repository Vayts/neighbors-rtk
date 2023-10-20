import { ChangeEvent, Ref } from 'react';
import DefaultTFuncReturn from 'i18next';

export interface IInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  name: string,
  error?: string,
  isInvalid?: boolean,
  isSecure?: boolean,
  value: string,
  placeholder?: string | typeof DefaultTFuncReturn,
  label?: string | typeof DefaultTFuncReturn,
  refValue?: Ref<HTMLInputElement> | null,
  disabled?: boolean,
}
