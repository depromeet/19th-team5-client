import { useState } from 'react';
import { Avatar, Button, Dialog } from '@/components/common';
import type { Interviewer } from '@/types/interview-room/interviewer';
import * as styles from './interviewerReviewDialog.css';

type InterviewerReviewDialogProps = {
  interviewers: readonly Interviewer[];
  onBackToLobby: () => void;
};

/**
 * 면접자가 면접 종료 다이얼로그에서 "면접관 평가하기"를 누르면 띄운다.
 * 도움이 된 면접관에게 좋아요를 보낼 수 있고(선택), 끝나면 로비로 돌아간다.
 * TODO(API): 좋아요를 서버에 보내는 API가 생기면 연결한다. 지금은 화면에만 남는다.
 */
export function InterviewerReviewDialog({
  interviewers,
  onBackToLobby,
}: InterviewerReviewDialogProps) {
  const [likedIds, setLikedIds] = useState<ReadonlySet<string>>(new Set());
  const like = (id: string) => setLikedIds((ids) => new Set([...ids, id]));

  return (
    <Dialog isOpen>
      <Dialog.Header className={styles.centeredText}>
        이번 면접관 어떠셨나요?
      </Dialog.Header>
      <Dialog.Description className={styles.centeredText}>
        도움이 된 면접관에게 좋아요를 보내주세요.
      </Dialog.Description>
      <Dialog.Body>
        <ul className={styles.list}>
          {interviewers.map(({ id, name, levelLabel, imageUrl }) => {
            const isLiked = likedIds.has(id);
            return (
              <li key={id} className={styles.card}>
                <Avatar className={styles.avatar} imageUrl={imageUrl} />
                <p className={styles.name}>{name}</p>
                <p className={styles.level}>면접관 · {levelLabel}</p>
                <Button
                  display='block'
                  disabled={isLiked}
                  aria-label={isLiked ? undefined : `${name}에게 좋아요`}
                  onClick={() => like(id)}
                >
                  {isLiked ? '좋아요 보냄' : '좋아요'}
                </Button>
              </li>
            );
          })}
        </ul>
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          variant='secondary'
          size='large'
          display='block'
          onClick={onBackToLobby}
        >
          로비로 돌아가기
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
