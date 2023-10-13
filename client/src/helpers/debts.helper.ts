import { ISelectValue } from '@src/components/UI/Select/types';
import { INeighborhood } from '@src/types/neighborhood.types';
import {
  DebtsFilterEnum,
  ICreateDebt,
  ICreateDebtDto,
  IDebt,
  IDebtTopItem,
  IEditDebt,
  IEditDebtDto,
} from '@src/types/debt.types';
import { IMember, IUser } from '@src/types/user.types';
import { Dictionary } from '@reduxjs/toolkit';

export function getSelectArrFromNeighborhoodMembers(
  neighborhood: INeighborhood,
  members: Dictionary<IMember>,
  userId: string,
): ISelectValue[] {
  if (!neighborhood) {
    return [];
  }
  
  const result: ISelectValue[] = [];
  
  neighborhood.members.forEach((item) => {
    if (item !== userId) {
      result.push({
        value: members[item]._id,
        text: members[item].fullName,
      });
    }
  });
  
  return result;
}

export function getCreateDebtDto(values: ICreateDebt): ICreateDebtDto {
  return {
    text: values.text.trim(),
    debtAmount: values.debtAmount.trim(),
    debtor_id: values.debtor_id,
    neighborhood_id: values.neighborhood_id,
    dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
  };
}

export function getEditDebtDto(values: IEditDebt): IEditDebtDto {
  return {
    text: values.text.trim(),
    debtAmount: values.debtAmount.trim(),
    dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
  };
}

export function getCreateDebtFormData(values: ICreateDebtDto): FormData {
  const formData = new FormData();
  
  Object.keys(values).forEach((key) => {
    formData.append(key, values[key] as string);
  });
  return formData;
}

export function getDebtTop(debts: IDebt[], userId: string, key: 'author' | 'debtor'): IDebtTopItem[] {
  return debts.filter((item) => item.debtAmount - item.repaidAmount > 0).reduce((acc: IDebtTopItem[], item) => {
    if (item[key] !== userId) {
      const alreadyAdded = acc.findIndex((debt) => debt.neighborhood === item.neighborhood && debt.user === item[key]);
      if (alreadyAdded >= 0) {
        acc[alreadyAdded].amount += item.debtAmount - item.repaidAmount;
      } else {
        acc.push({
          amount: item.debtAmount - item.repaidAmount,
          user: item[key],
          neighborhood: item.neighborhood,
        });
      }
    }
    
    return acc;
  }, []);
}

export function getVisibleDebts(debts: IDebt[], filter: DebtsFilterEnum, user: IUser): IDebt[] {
  const filterCb = (debt: IDebt) => {
    switch (filter) {
    case DebtsFilterEnum.active:
      return debt.debtAmount - debt.repaidAmount > 0;
    case DebtsFilterEnum.closed:
      return debt.debtAmount - debt.repaidAmount <= 0;
    case DebtsFilterEnum.overdue:
      if (debt.dueDate && debt.debtAmount > debt.repaidAmount) {
        return new Date() > new Date(debt.dueDate as Date);
      }
      return false;
    case DebtsFilterEnum.myDebts:
      return debt.debtor === user._id && debt.debtAmount > debt.repaidAmount;
    case DebtsFilterEnum.myDebtors:
      return debt.author === user._id && debt.debtAmount > debt.repaidAmount;
    case DebtsFilterEnum.all:
    default:
      return true;
    }
  };
  
  return debts.filter(filterCb);
}

export function getDebtEditState(debts: IDebt[], debtId?: string): IDebt | null {
  if (!debtId) return null;
  
  const debtForEdit = debts.find((item) => item._id === debtId);
  
  if (debtForEdit) {
    return debtForEdit;
  }
  
  return null;
}
