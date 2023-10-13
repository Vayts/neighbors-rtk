import DefaultTFuncReturn from 'i18next';

export interface ICheckboxProps {
  onChange: (name: string, val: boolean) => void,
  name: string,
  checked: boolean,
  label: string | typeof DefaultTFuncReturn,
  disabled?: boolean,
}
