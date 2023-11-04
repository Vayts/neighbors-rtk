import { ICreateDuty, ICreateDutyDto, IEditDuty, IEditDutyDto } from '@src/types/duty.types';
import { EntityId } from '@reduxjs/toolkit';

export function getCreateDutyDto(values: ICreateDuty, members: EntityId[]): ICreateDutyDto {
  return {
    isAllMembersInvited: values.isAllMembersInvited,
    name: values.name.trim(),
    neighborhood_id: values.neighborhood_id,
    participants: values.isAllMembersInvited ? members.map((item) => item) : values.participants,
  };
}

export function getEditDutyDto(values: IEditDuty): IEditDutyDto {
  return {
    name: values.name.trim(),
  };
}
