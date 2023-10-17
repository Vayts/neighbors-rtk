import React from 'react';

export interface IAvatarSelectModalProps {
  currentAvatar: string,
  onClose: () => void;
  onSubmit: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
