import React from 'react';

export interface IModalProps {
  children?: React.ReactNode
  outsideHandler?: () => void;
  closeFunc?: () => void;
  withCloseIcon?: boolean,
}
