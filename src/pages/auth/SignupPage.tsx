import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { authApi } from '@/apis/AuthApi';
import { Button } from '@/components/common/button';
import { Checkbox } from '@/components/common/checkbox';
import { TextField } from '@/components/common/text-field';
import { useAuthForm } from '@/hooks/auth/useAuthForm';
import * as styles from './Auth.css';
import { AuthLayout } from './AuthLayout';
import { NewPasswordFields } from './components/NewPasswordFields';

export function SignupPage() {
  const { state } = useLocation();
  const { onSubmit, pending, failure, error } = useAuthForm(
    authApi.signup,
    'signup',
  );
  const [showTerms, setShowTerms] = useState(false);

  return (
    <AuthLayout
      title='방문 출입증부터 만들어요'
      description='로그인 정보를 입력해주세요.'
    >
      <form method='post' onSubmit={onSubmit} aria-busy={pending}>
        <div className={styles.fields}>
          <TextField
            className={styles.field}
            label='이메일'
            type='email'
            name='email'
            autoComplete='username'
            placeholder='name@email.com'
            required
          />
          <NewPasswordFields />
        </div>
        <div className={styles.agreement}>
          <label className={styles.consent} htmlFor='terms-consent'>
            <Checkbox id='terms-consent' required />
            (필수) 이용약관 · 개인정보 처리에 동의해요
          </label>
          <button
            type='button'
            className={styles.details}
            aria-expanded={showTerms}
            aria-controls='terms-details'
            onClick={() => setShowTerms(!showTerms)}
          >
            {showTerms ? '닫기' : '보기'}
          </button>
        </div>
        <p
          id='terms-details'
          className={styles.termsNotice}
          hidden={!showTerms}
        >
          이용약관 및 개인정보 처리 안내를 준비 중이에요.
        </p>
        <Button
          disabled={pending}
          type='submit'
          size='large'
          display='block'
          className={styles.submit}
        >
          {pending ? '가입 중…' : '다음'}
        </Button>
        {error && (
          <p className={styles.error} role='alert'>
            {error}{' '}
            {failure === 'duplicate-email' && (
              <Link to='/login' state={state} className={styles.link}>
                로그인
              </Link>
            )}
          </p>
        )}
      </form>
    </AuthLayout>
  );
}
