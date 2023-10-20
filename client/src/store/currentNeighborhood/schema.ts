import { schema } from 'normalizr';

const memberSchema = new schema.Entity('member', {}, { idAttribute: '_id' });

const eventsSchema = new schema.Entity('events', {
  author: [memberSchema],
}, { idAttribute: '_id' });

export const currentNeighborhoodSchema = new schema.Entity('neighborhoods', {
  members: [memberSchema],
  events: [eventsSchema],
}, { idAttribute: '_id' });
