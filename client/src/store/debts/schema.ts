import { schema } from 'normalizr';

const userSchema = new schema.Entity('users', {}, { idAttribute: '_id' });
const neighborhoodSchema = new schema.Entity('neighborhoods', {}, { idAttribute: '_id' });

export const debtSchema = new schema.Entity('debts', {
  author: userSchema,
  debtor: userSchema,
  neighborhood: neighborhoodSchema,
}, { idAttribute: '_id' });
