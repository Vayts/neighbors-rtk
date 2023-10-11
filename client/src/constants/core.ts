import { CurrencyEnum } from '@src/types/default.types';

export const STATIC_HREF = 'http://localhost:4020/img';

export const CURRENT_CURRENCIES = [
  {
    text: 'UAH - Українська гривня',
    value: CurrencyEnum.UAH,
  },
  {
    text: 'USD - American dollar',
    value: CurrencyEnum.USD,
  },
  {
    text: 'EUR - Euro',
    value: CurrencyEnum.EUR,
  },
];

export const NO_SMOOTH_SCROLL_VALUE = 600;
