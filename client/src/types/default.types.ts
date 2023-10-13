export type ErrorType = Record<string, string>;

export interface CustomDateEventChange {
  target: {
    name: string,
    value: Date | null,
  }
}

export enum ErrorEnum {
  app = 'app',
  neighborhood = 'neighborhood',
  debt = 'debt',
  plan = 'plan',
  auth = 'auth',
}

export enum CurrencyEnum {
  USD = 'USD',
  UAH = 'UAH',
  EUR = 'EUR',
}

export enum CurrencySymbolEnum {
  USD = '$',
  UAH = '₴',
  EUR = '€',
}

export type CurrencyType = CurrencyEnum.USD | CurrencyEnum.UAH | CurrencyEnum.EUR;
