import { type SyntheticEvent, useRef, useState } from 'react';
import { TextField } from '@/components/common/text-field';
import { passwordHint, passwordPattern } from '@/utils/AuthPassword';
import * as styles from '../Auth.css';

const mismatchMessage = '비밀번호가 서로 달라요';

export function NewPasswordFields({ label = '비밀번호' }: { label?: string }) {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLInputElement>(null);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [mismatch, setMismatch] = useState(false);

  function showPasswordError(event: SyntheticEvent<HTMLInputElement>) {
    setPasswordInvalid(event.currentTarget.validity.patternMismatch);
  }

  function validateConfirmation() {
    const confirmation = confirmationRef.current;
    if (!confirmation) return;
    const differs =
      confirmation.value !== '' &&
      confirmation.value !== passwordRef.current?.value;
    confirmation.setCustomValidity(differs ? mismatchMessage : '');
    setMismatch(differs);
  }

  return (
    <>
      <TextField
        ref={passwordRef}
        className={styles.field}
        label={label}
        type='password'
        name='password'
        autoComplete='new-password'
        placeholder={passwordHint}
        title={passwordHint}
        pattern={passwordPattern.source}
        required
        error={passwordInvalid}
        helperText={passwordInvalid ? passwordHint : undefined}
        onBlur={showPasswordError}
        onInvalid={showPasswordError}
        onChange={(event) => {
          if (passwordInvalid) showPasswordError(event);
          validateConfirmation();
        }}
      />
      <TextField
        ref={confirmationRef}
        className={styles.field}
        label={`${label} 확인`}
        type='password'
        name='confirmation'
        autoComplete='new-password'
        placeholder='비밀번호를 다시 입력해 주세요'
        required
        onChange={validateConfirmation}
        error={mismatch}
        helperText={mismatch ? mismatchMessage : undefined}
      />
    </>
  );
}
