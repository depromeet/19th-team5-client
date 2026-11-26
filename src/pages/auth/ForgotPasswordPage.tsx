import {
  type ActionFunctionArgs,
  Form,
  Link,
  useActionData,
  useLocation,
  useNavigation,
} from 'react-router';
import { authApi } from '@/apis/AuthApi';
import { Button } from '@/components/common/button';
import { TextField } from '@/components/common/text-field';
import { useAuthStore } from '@/stores/AuthStore';
import * as styles from './Auth.css';
import { AuthLayout } from './AuthLayout';

export async function requestResetAction({ request }: ActionFunctionArgs) {
  const email = (await request.formData()).get('email');
  if (typeof email !== 'string') return '이메일을 입력해 주세요.';
  try {
    const issued = await authApi.requestPasswordReset(email, request.signal);
    return issued ? null : '가입한 이메일을 확인해 주세요.';
  } catch {
    return '재설정 링크를 만들지 못했어요. 다시 시도해 주세요.';
  }
}

export function ForgotPasswordPage() {
  const ticket = useAuthStore((state) => state.resetTicket);
  const error = useActionData<typeof requestResetAction>();
  const pending = useNavigation().state !== 'idle';
  const { state } = useLocation();
  return (
    <AuthLayout
      title='비밀번호 찾기'
      description='가입할 때 사용한 이메일을 입력해 주세요.'
    >
      <Form method='post' state={state} aria-busy={pending}>
        <div className={styles.fields}>
          <TextField
            className={styles.field}
            type='email'
            name='email'
            label='이메일'
            autoComplete='username'
            placeholder='name@email.com'
            defaultValue={ticket?.email}
            required
          />
        </div>
        <Button type='submit' size='large' display='block' disabled={pending}>
          재설정 링크 요청
        </Button>
        {error && (
          <p role='alert' className={styles.error}>
            {error}
          </p>
        )}
      </Form>
      {ticket && !error && ticket.expiresAt > Date.now() && (
        <section className={styles.mockMail} aria-label='모의 메일함'>
          <strong>모의 메일함</strong>
          <p className={styles.notice}>
            {ticket.email} 계정의 재설정 링크예요. 15분 안에 열어 주세요.
          </p>
          <Link className={styles.link} to='/reset-password' state={state}>
            비밀번호 재설정하기
          </Link>
        </section>
      )}
      <div className={styles.links}>
        <Link className={styles.link} to='/login' state={state}>
          로그인으로 돌아가기
        </Link>
      </div>
    </AuthLayout>
  );
}
