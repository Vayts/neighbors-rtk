import { ICreateNeighborhood, INeighborhood } from '@src/types/neighborhood.types';
import { ISelectValue } from '@src/components/UI/Select/types';
import { EntityId } from '@reduxjs/toolkit';

export function getCreateNeighborhoodFormData(values: ICreateNeighborhood): FormData {
  const formData = new FormData();
  
  formData.append('name', values.name.trim());
  formData.append('description', values.description.trim());
  formData.append('currency', values.currency.trim());
  
  return formData;
}

export function getSelectArrFromNeighborhoods(neighborhoods: INeighborhood[]): ISelectValue[] {
  return neighborhoods.map((item) => {
    return {
      text: item.name,
      value: item._id,
    };
  });
}

export function getFavoriteNeighborhoods(neighborhoods: INeighborhood[], currentId: string | null): INeighborhood[] {
  const filteredNeighborhoods = neighborhoods.filter((item) => item.isFavorite || item._id === currentId);
  
  return filteredNeighborhoods.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) {
      return -1;
    }
    if (!a.isFavorite && b.isFavorite) {
      return 1;
    }
    return 0;
  });
}
export function getMembersWithoutUser(
  neighborhood: INeighborhood,
  userId: string,
): EntityId[] {
  if (!neighborhood) {
    return [];
  }
  return neighborhood.members.filter((item) => item !== userId);
}
