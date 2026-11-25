import type { Avatar } from '../../AvatarDraft';
import * as styles from '../../Signup.css';

export function ResumePreview({
  avatar,
  nickname,
  jobLabel,
}: {
  avatar: Avatar;
  nickname: string;
  jobLabel: string;
}) {
  return (
    <>
      <div
        className={styles.resumeSample}
        role='img'
        aria-label={`${nickname}님의 이력서 예시`}
      >
        <div className={styles.sampleHeader} aria-hidden='true'>
          <img
            className={styles.samplePortrait}
            src={`/images/signup/${avatar}-profile.png`}
            alt=''
          />
          <div>
            <strong className={styles.sampleName}>{nickname}</strong>
            <span className={styles.sampleJob}>{jobLabel}</span>
          </div>
        </div>
      </div>
      <p className={styles.sampleCaption}>이력서는 면접관에게만 보여요</p>
    </>
  );
}
