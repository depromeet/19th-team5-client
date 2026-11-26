import { Link } from 'react-router';
import { authApi } from '@/apis/AuthApi';
import logo from '@/assets/icons/auth-logo.svg';
import { Button } from '@/components/common/button';
import { TextField } from '@/components/common/text-field';
import * as styles from './Auth.css';
import { AuthLayout } from './AuthLayout';
import { useAuthForm } from './useAuthForm';

export function LoginPage() {
  const { onSubmit, pending, error } = useAuthForm(authApi.login, 'login');
  return (
    <AuthLayout
      brand={
        <div className={styles.brand}>
          <img src={logo} alt='' width={32} height={32} />
          LOGO
        </div>
      }
      title='출입증 확인할게요'
      description='이메일로 로그인해 주세요.'
    >
      <form method='post' aria-busy={pending} onSubmit={onSubmit}>
        <div className={styles.fields}>
          <TextField
            className={styles.field}
            label='이메일'
            name='email'
            type='email'
            autoComplete='username'
            placeholder='name@email.com'
            required
          />
          <TextField
            className={styles.field}
            label='비밀번호'
            name='password'
            type='password'
            autoComplete='current-password'
            placeholder='비밀번호를 입력해 주세요'
            required
          />
        </div>
        <Button
          disabled={pending}
          type='submit'
          size='large'
          display='block'
          className={styles.submit}
        >
          {pending ? '로그인 중…' : '로그인'}
        </Button>
        {error && (
          <p className={styles.error} role='alert'>
            {error}
          </p>
        )}
      </form>
      <div className={styles.links}>
        <Link className={styles.link} to='/signup'>
          회원가입
        </Link>
        <span aria-hidden='true'>·</span>
        <Link className={styles.link} to='/forgot-password'>
          비밀번호 찾기
        </Link>
      </div>
    </AuthLayout>
  );
}
