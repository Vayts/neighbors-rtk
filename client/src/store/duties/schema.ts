import { schema } from 'normalizr';

const dutyParticipantSchema = new schema.Entity('participants', {}, { idAttribute: '_id' });

const userSchema = new schema.Entity('users', {}, { idAttribute: '_id' });

const neighborhoodSchema = new schema.Entity('neighborhoods', {}, { idAttribute: '_id' });

export const dutySchema = new schema.Entity('duties', {
  neighborhood: neighborhoodSchema,
  author: userSchema,
  participants: [dutyParticipantSchema],
}, { idAttribute: '_id' });
