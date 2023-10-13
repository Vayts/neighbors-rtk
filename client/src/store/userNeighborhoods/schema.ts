import { schema } from 'normalizr';

const memberSchema = new schema.Entity('members', {}, { idAttribute: '_id' });

export const neighborhoodSchema = new schema.Entity('neighborhoods', {
  members: [memberSchema],
}, { idAttribute: '_id' });
