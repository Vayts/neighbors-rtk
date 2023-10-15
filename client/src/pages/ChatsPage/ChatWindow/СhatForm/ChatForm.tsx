import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-tooltip';
import styles from './ChatForm.module.scss';

type Props = {
  onSubmit: (message: string) => void;
}

const ChatForm: React.FC<Props> = ({ onSubmit }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inFocus, setInFocus] = useState(false);
  const { t } = useTranslation();
  
  const handleOnFocus = () => {
    setInFocus(true);
  };
  
  const handleOnBlur = () => {
    setInFocus(false);
  };
  
  const handleInput = () => {
    const input = inputRef.current as HTMLTextAreaElement;
    
    input.style.height = '22px';
    input.style.height = `${input.scrollHeight}px`;
  };
  
  useEffect(() => {
    handleInput();
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  
  const handleSendMessage = () => {
    if (value) {
      onSubmit(value);
      setValue('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.ctrlKey) {
      e.preventDefault();
      handleSendMessage();
    }
    
    if (e.key === 'Enter' && e.ctrlKey) {
      setValue((prev) => `${prev}\r\n`);
    }
  };
  
  return (
    <div
      onKeyDown={handleKeyDown}
      className={cn(styles.ChatFormWrapper, inFocus && styles.ChatFormWrapperFocused)}
    >
      <div className={styles.ChatInputWrapper}>
        <textarea
          value={value}
          onChange={handleChange}
          className={styles.ChatInput}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          placeholder={t('enterMessage')}
          ref={inputRef}
        />
      </div>
      
      <div className={styles.ChatBottomContent}>
        <button
          aria-label="send"
          className={cn('icon-send', styles.ChatButton)}
          data-tooltip-id="chat-button"
          type='submit'
          id='xz'
          onClick={handleSendMessage}
        />
      </div>
      
      <Tooltip
        style={{
          whiteSpace: 'pre-line',
          textAlign: 'center',
        }}
        id="chat-button"
        place="bottom"
        content={`${t('sendAction')}`}
      />
    </div>
  );
};

export default ChatForm;
