import { ILogin, IRegister } from '@src/types/auth.types';

export function getRegisterFormData(values: IRegister): FormData {
  const formData = new FormData();
  
  formData.append('firstName', values.firstName.trim());
  formData.append('lastName', values.lastName.trim());
  formData.append('login', values.login.trim());
  formData.append('password', values.password.trim());
  
  return formData;
}

export function getLoginFormData(values: ILogin): FormData {
  const formData = new FormData();
  
  formData.append('login', values.login.trim());
  formData.append('password', values.password.trim());
  
  return formData;
}
