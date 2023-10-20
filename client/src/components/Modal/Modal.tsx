import React, { useEffect, useRef } from 'react';
import { IModalProps } from '@src/components/Modal/types';
import { useOutsideClick } from '@src/hooks/useOutsideClick';
import cn from 'classnames';
import { hideScrollbar, showScrollbar } from '@helpers/visual.helper';
import { createPortal } from 'react-dom';
import styles from './Modal.module.scss';

const Modal: React.FC<IModalProps> = ({ children, outsideHandler, withCloseIcon, closeFunc }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClick(modalRef, outsideHandler || (() => null));
  
  const handleEscapeKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (outsideHandler) {
        outsideHandler();
        return;
      }
      if (closeFunc) {
        closeFunc();
      }
    }
  };
  
  const handleClose = () => {
    if (outsideHandler) {
      outsideHandler();
      return;
    }
    if (closeFunc) {
      closeFunc();
    }
  };
  
  useEffect(() => {
    const hasScroll = document.documentElement.scrollHeight > window.innerHeight;
    window.addEventListener('keydown', handleEscapeKeyPress);
    
    if (hasScroll) {
      hideScrollbar();
      
      return () => {
        showScrollbar();
        window.removeEventListener('keydown', handleEscapeKeyPress);
      };
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, []);
  
  const mount = document.getElementById('portal-root');
  
  return createPortal(
    <div className={styles.ModalBg}>
      <div
        ref={modalRef}
        className={styles.ModalContent}
      >
        {withCloseIcon && (
          <span
            className={cn('icon-cross', styles.ModalClose)}
            onClick={handleClose}
          />
        )}
        {children}
      </div>
    </div>,
    mount as HTMLElement,
  );
};

export default Modal;
