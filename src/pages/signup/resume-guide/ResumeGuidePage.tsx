import { Navigate, useNavigate } from 'react-router';
import { signupApi } from '@/apis/SignupApi';
import { Button } from '@/components/common/button';
import { isComplete } from '../AvatarDraft';
import { SignupStep } from '../components/SignupStep';
import * as styles from '../Signup.css';
import { useAvatarDraft, useSignupOptions } from '../SignupLayout';
import { ResumePreview } from './components/ResumePreview';

const benefits = [
  {
    icon: 'resume-question',
    title: '내 경험에 맞춘 2부 질문',
    description: '면접관이 이력서를 읽고 질문을 준비해요',
  },
  {
    icon: 'resume-feedback',
    title: '더 구체적인 피드백',
    description: '어떤 경험이 잘 전달됐는지 키워드로 받아요',
  },
  {
    icon: 'resume-profile',
    title: '한 번만 쓰면 계속 써요',
    description: '마이페이지에서 언제든 고칠 수 있어요',
  },
];

export function ResumeGuidePage() {
  const [draft] = useAvatarDraft();
  const { previewJobLabel } = useSignupOptions();
  const navigate = useNavigate();
  if (!isComplete(draft)) return <Navigate to='/signup/avatar' replace />;
  return (
    <SignupStep
      title='이력서 쓰면 질문이 깊어져요'
      notice='안 써도 기본 인성면접은 볼 수 있어요.'
      previewClassName={styles.resumePreview}
      preview={
        <ResumePreview
          avatar={draft.avatar}
          nickname={draft.nickname}
          jobLabel={previewJobLabel}
        />
      }
    >
      <div className={styles.controls}>
        <ul className={styles.benefits}>
          {benefits.map(({ icon, title, description }) => (
            <li key={icon} className={styles.benefit}>
              <img
                src={`/images/signup/${icon}.svg`}
                width={48}
                height={48}
                alt=''
              />
              <div>
                <h2 className={styles.benefitTitle}>{title}</h2>
                <p className={styles.benefitText}>{description}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <Button
            size='large'
            display='block'
            onClick={() => navigate('/signup/resume', { state: draft })}
          >
            이력서 작성하기
          </Button>
          <Button
            size='large'
            display='block'
            variant='outline'
            onClick={async () => {
              const pass = await signupApi.completeSignup(draft);
              navigate('/signup/pass', { state: pass });
            }}
          >
            건너뛰기
          </Button>
        </div>
      </div>
    </SignupStep>
  );
}
