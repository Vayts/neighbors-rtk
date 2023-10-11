import { NotificationType } from '@src/types/notification.types';
import { toast } from 'react-toastify';

export function getNotification(text: string, type = 'success'): void {
  toast[type as NotificationType](text);
}
