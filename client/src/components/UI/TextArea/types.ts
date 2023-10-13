import { ChangeEvent, Ref } from 'react';
import DefaultTFuncReturn from 'i18next';

export interface ITextAreaProps {
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void,
  name: string,
  error?: string,
  isInvalid?: boolean,
  value: string,
  placeholder?: string | typeof DefaultTFuncReturn,
  label?: string | typeof DefaultTFuncReturn,
  refValue?: Ref<HTMLTextAreaElement> | null,
}
