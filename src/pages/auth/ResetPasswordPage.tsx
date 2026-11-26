import {
  type ActionFunctionArgs,
  Form,
  Link,
  useActionData,
  useNavigation,
} from 'react-router';
import { authApi } from '@/apis/AuthApi';
import { Button } from '@/components/common/button';
import { useAuthStore } from '@/stores/AuthStore';
import { passwordHint } from '@/utils/AuthPassword';
import * as styles from './Auth.css';
import { AuthLayout } from './AuthLayout';
import { NewPasswordFields } from './components/NewPasswordFields';

export async function resetPasswordAction({ request }: ActionFunctionArgs) {
  const data = await request.formData();
  const ticket = useAuthStore.getState().resetTicket;
  if (!ticket || ticket.id !== data.get('requestId')) return 'invalid-link';
  const password = data.get('password');
  if (typeof password !== 'string' || password !== data.get('confirmation'))
    return 'invalid-password';
  try {
    return await authApi.resetPassword(ticket, password, request.signal);
  } catch {
    return 'unavailable';
  }
}

export function ResetPasswordPage() {
  const ticket = useAuthStore((state) => state.resetTicket);
  const result = useActionData<typeof resetPasswordAction>();
  const pending = useNavigation().state !== 'idle';
  if (result === 'success')
    return (
      <AuthLayout
        title='비밀번호를 변경했어요'
        description='새 비밀번호로 로그인해 주세요.'
      >
        <Link className={styles.link} to='/login' replace>
          로그인하기
        </Link>
      </AuthLayout>
    );
  if (!ticket || ticket.expiresAt <= Date.now() || result === 'invalid-link')
    return (
      <AuthLayout
        title='재설정 링크를 사용할 수 없어요'
        description='가입한 이메일로 새 링크를 요청해 주세요.'
      >
        <Link className={styles.link} to='/forgot-password' replace>
          새 링크 요청하기
        </Link>
      </AuthLayout>
    );
  return (
    <AuthLayout
      title='새 비밀번호 설정'
      description='로그인에 사용할 새 비밀번호를 입력해 주세요.'
    >
      <Form method='post' aria-busy={pending}>
        <input type='hidden' name='requestId' value={ticket.id} />
        <div className={styles.fields}>
          <NewPasswordFields label='새 비밀번호' />
        </div>
        <Button type='submit' size='large' display='block' disabled={pending}>
          비밀번호 변경
        </Button>
        {result === 'invalid-password' && (
          <p className={styles.error} role='alert'>
            {passwordHint}으로 동일하게 입력해 주세요.
          </p>
        )}
        {result === 'unavailable' && (
          <p className={styles.error} role='alert'>
            비밀번호를 변경하지 못했어요. 다시 시도해 주세요.
          </p>
        )}
      </Form>
      <div className={styles.links}>
        <Link className={styles.link} to='/login'>
          로그인으로 돌아가기
        </Link>
      </div>
    </AuthLayout>
  );
}
