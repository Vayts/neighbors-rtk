import { ICreatePlan, ICreatePlanDto, IEditPlan, IEditPlanDto, IParticipantPayment } from '@src/types/plan.types';
import { EntityId } from '@reduxjs/toolkit';

export function getCreatePlanDto(values: ICreatePlan, members: EntityId[]): ICreatePlanDto {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    eventDate: values.eventDate ? new Date(values.eventDate).toISOString() : null,
    isPaymentRequired: values.isPaymentRequired,
    isTasksListRequired: values.isTasksListRequired,
    neighborhood_id: values.neighborhood_id,
    participants: values.isAllMembersInvited ? members.map((item) => item) : values.participants,
    paymentAmount: values.isPaymentRequired ? values.paymentAmount.trim() : null,
    tasksList: values.isTasksListRequired ? values.tasksList.map((item) => item.text) : null,
  };
}

export function getDataForProgressBar(
  total: number,
  current: number,
  participantPayments: IParticipantPayment[],
  userId: string,
): [number, number, number] {
  const currentUserPayment = participantPayments.find((item) => item.participant_id === userId)?.payment as number;
  const currentPaymentWithoutUser = current - currentUserPayment;
  
  const percentageWithoutUser = Math.round((currentPaymentWithoutUser / total) * 100);
  const userPercentage = Math.round((currentUserPayment / total) * 100);
  
  return [percentageWithoutUser, userPercentage, currentUserPayment];
}

export function getEditPlanDto(values: IEditPlan): IEditPlanDto {
  return {
    description: values.description.trim(),
    name: values.name.trim(),
    paymentAmount: values.paymentAmount.trim() ? values.paymentAmount : null,
    eventDate: values.eventDate ? new Date(values.eventDate).toISOString() : null,
  };
}
