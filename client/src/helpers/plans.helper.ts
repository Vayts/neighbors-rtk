import { ICreatePlan, ICreatePlanDto, IEditPlan, IEditPlanDto, IPlan, IPlanParticipant } from '@src/types/plan.types';
import { IMember } from '@src/types/user.types';

export function getCreatePlanDto(values: ICreatePlan, members: IMember[]): ICreatePlanDto {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    eventDate: values.eventDate ? new Date(values.eventDate).toISOString() : null,
    isPaymentRequired: values.isPaymentRequired,
    isTasksListRequired: values.isTasksListRequired,
    neighborhood_id: values.neighborhood_id,
    participants: values.isAllMembersInvited ? members.map((item) => item._id) : values.participants,
    paymentAmount: values.isPaymentRequired ? values.paymentAmount.trim() : null,
    tasksList: values.isTasksListRequired ? values.tasksList.map((item) => item.text) : null,
  };
}

export function getDataForProgressBar(
  total: number,
  current: number,
  participants: IPlanParticipant[],
  userId: string,
): [number, number, number] {
  const currentUserPayment = participants.find((item) => item._id === userId)?.payment as number;
  const currentPaymentWithoutUser = current - currentUserPayment;
  
  const percentageWithoutUser = Math.round((currentPaymentWithoutUser / total) * 100);
  const userPercentage = Math.round((currentUserPayment / total) * 100);
  
  return [percentageWithoutUser, userPercentage, currentUserPayment];
}

export function getPlanEditItem(plans: IPlan[], planId?: string): IPlan | null {
  if (!planId) return null;
  
  const planForEdit = plans.find((item) => item._id === planId);
  
  if (planForEdit) {
    return planForEdit;
  }
  
  return null;
}

export function getEditPlanDto(values: IEditPlan): IEditPlanDto {
  return {
    description: values.description.trim(),
    name: values.name.trim(),
    paymentAmount: values.paymentAmount.trim() ? values.paymentAmount : null,
    eventDate: values.eventDate ? new Date(values.eventDate).toISOString() : null,
  };
}
