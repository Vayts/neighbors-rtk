import { schema } from 'normalizr';

const planParticipantSchema = new schema.Entity('participants', {}, { idAttribute: '_id' });

const userSchema = new schema.Entity('users', {}, { idAttribute: '_id' });

export const planSchema = new schema.Entity('plans', {
  author: userSchema,
  participants: [planParticipantSchema],
}, { idAttribute: '_id' });
