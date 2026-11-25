import { useMutation } from '@tanstack/react-query';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { signupApi } from '@/apis/SignupApi';
import { Button } from '@/components/common/button';
import {
  type Avatar,
  avatars,
  isComplete,
  nicknameLength,
  nicknameLimit,
} from '../AvatarDraft';
import { SignupStep } from '../components/SignupStep';
import * as styles from '../Signup.css';
import { useAvatarDraft } from '../SignupLayout';
import { AvatarPreview } from './components/AvatarPreview';

const avatarChoices: Avatar[] = ['boy', 'girl'];
export function AvatarSelectionPage() {
  const [draft, setDraft] = useAvatarDraft();
  const navigate = useNavigate();
  const nicknameSuggestion = useMutation({
    mutationFn: signupApi.suggestNickname,
  });
  const count = nicknameLength(draft.nickname);
  const hasOnlySpaces = count > 0 && !draft.nickname.trim();
  const error =
    count > nicknameLimit
      ? '공백 포함 최대 6자 이내로 입력해주세요.'
      : hasOnlySpaces
        ? '공백만으로는 닉네임을 만들 수 없어요.'
        : '';
  const helper =
    error || '면접 시 사용할 이름이에요. 가입 후에는 바꿀 수 없어요.';
  const ready = isComplete(draft);

  function updateNickname(nickname: string) {
    setDraft((prev) => ({ ...prev, nickname }));
  }

  function drawNickname() {
    nicknameSuggestion.mutate(draft.nickname, {
      onSuccess: (nickname, previous) => {
        setDraft((current) =>
          current.nickname === previous ? { ...current, nickname } : current,
        );
      },
    });
  }

  function confirm(event: FormEvent) {
    event.preventDefault();
    if (ready) navigate('/signup/resume-guide', { state: draft });
  }

  return (
    <SignupStep
      title='이력서 사진 골라볼까요?'
      notice='아바타는 마이페이지에서 수정 가능해요.'
      preview={
        <AvatarPreview key={draft.avatar} avatar={draft.avatar ?? 'girl'} />
      }
    >
      <form className={styles.controls} onSubmit={confirm}>
        <label className={styles.label} htmlFor='nickname'>
          닉네임{' '}
          <span className={styles.required} aria-hidden='true'>
            *
          </span>
        </label>
        <div className={styles.nicknameRow}>
          <div className={styles.field} data-invalid={Boolean(error)}>
            <input
              id='nickname'
              name='nickname'
              className={styles.input}
              autoComplete='nickname'
              placeholder='닉네임을 입력해주세요'
              value={draft.nickname}
              onChange={(event) => updateNickname(event.target.value)}
              required
              aria-invalid={Boolean(error)}
              aria-describedby={
                count > 0 ? 'nickname-count nickname-help' : 'nickname-count'
              }
            />
            <span id='nickname-count' className={styles.count}>
              {count} / {nicknameLimit}
            </span>
          </div>
          <Button
            className={styles.randomButton}
            onClick={drawNickname}
            disabled={nicknameSuggestion.isPending}
          >
            랜덤으로 뽑기
          </Button>
        </div>
        {nicknameSuggestion.isError && (
          <p className={styles.helper} role='alert'>
            닉네임을 불러오지 못했어요. 다시 시도해 주세요.
          </p>
        )}
        {count > 0 && (
          <p
            id='nickname-help'
            className={styles.helper}
            data-invalid={Boolean(error)}
            aria-live='polite'
          >
            {helper}
          </p>
        )}
        <fieldset className={styles.choices}>
          <legend className={styles.visuallyHidden}>이력서 사진 선택</legend>
          {avatarChoices.map((avatar) => (
            <label key={avatar} className={styles.option}>
              <input
                className={styles.visuallyHidden}
                type='radio'
                name='avatar'
                value={avatar}
                checked={draft.avatar === avatar}
                onChange={() => setDraft((prev) => ({ ...prev, avatar }))}
                aria-label={avatars[avatar]}
                required
              />
              <img
                className={styles.portrait}
                src={`/images/signup/${avatar}-portrait.png`}
                alt=''
              />
            </label>
          ))}
        </fieldset>
        <div className={styles.actions}>
          <Button type='submit' size='large' display='block' disabled={!ready}>
            이 모습으로 할게요
          </Button>
        </div>
      </form>
    </SignupStep>
  );
}
