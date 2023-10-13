import { ICreateNeighborhood, INeighborhood } from '@src/types/neighborhood.types';
import { ISelectValue } from '@src/components/UI/Select/types';
import { IMember } from '@src/types/user.types';

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

export function getSelectedNeighborhoodById(neighborhoods: INeighborhood[], id: string): INeighborhood | undefined {
  return neighborhoods.find((item) => item._id === id);
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
export function getMembersFromNeighborhoodMembers(
  neighborhoods: INeighborhood[],
  neighborhoodId: string,
  userId: string,
): IMember[] {
  if (!neighborhoodId) {
    return [];
  }
  
  const currentNeighborhood = neighborhoods.find((item) => item._id === neighborhoodId);
  
  if (!currentNeighborhood) {
    return [];
  }
  
  const result: IMember[] = [];
  
  currentNeighborhood.members.forEach((item) => {
    if (item._id !== userId) {
      result.push(item);
    }
  });
  
  return result;
}
