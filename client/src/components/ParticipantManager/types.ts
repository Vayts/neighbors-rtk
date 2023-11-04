import { EntityId } from '@reduxjs/toolkit';

export interface IParticipantManager {
  participants: EntityId[],
  neighborhoodId: EntityId,
  onParticipantAdd: (participantId: string) => void,
  onParticipantRemove: (participantId: string) => void,
}
