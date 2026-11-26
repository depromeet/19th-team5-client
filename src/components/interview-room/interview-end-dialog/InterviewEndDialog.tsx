import { Button, Dialog } from '@/components/common';
import { formatDurationLabel } from '@/utils/formatTime';
import { EvaluationSummary } from './EvaluationSummary';
import * as styles from './interviewEndDialog.css';

type InterviewEndDialogProps = {
  /** 내 아바타 전신 이미지 */
  avatarImageUrl: string;
} & (
  | {
      myRole: 'interviewee';
      onBackToLobby: () => void;
      onEvaluateInterviewers: () => void;
    }
  | {
      myRole: 'interviewer';
      /** 평가표를 낼 수 있는 시간(초). 다이얼로그가 열린 때부터 센다. */
      evaluationSeconds: number;
      onWriteEvaluation: () => void;
    }
);

/**
 * 면접이 끝나면 띄우는 다이얼로그. 면접자는 로비로 돌아가거나 면접관을 평가하고,
 * 면접관은 정해진 시간 안에 면접자 평가표를 쓴다. 열린 동안에는 닫히지 않는다.
 */
export function InterviewEndDialog(props: InterviewEndDialogProps) {
  return (
    <Dialog isOpen>
      <div className={styles.avatar}>
        <img className={styles.avatarImage} src={props.avatarImageUrl} alt='' />
      </div>
      <Dialog.Header className={styles.centeredText}>
        수고했어요, 면접 끝!
      </Dialog.Header>
      {props.myRole === 'interviewee' ? (
        <>
          <Dialog.Description className={styles.centeredText}>
            면접결과는 면접관 피드백 이후 알림으로 전송돼요.
            <br />그 동안 면접관 평가를 남겨보세요.
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              variant='secondary'
              size='large'
              display='block'
              onClick={props.onBackToLobby}
            >
              로비로 돌아가기
            </Button>
            <Button
              size='large'
              display='block'
              onClick={props.onEvaluateInterviewers}
            >
              면접관 평가하기
            </Button>
          </Dialog.Footer>
        </>
      ) : (
        <>
          <Dialog.Description className={styles.centeredText}>
            {formatDurationLabel(props.evaluationSeconds)} 안에 면접자 평가표를
            남겨 주세요.
          </Dialog.Description>
          <Dialog.Body>
            <EvaluationSummary evaluationSeconds={props.evaluationSeconds} />
          </Dialog.Body>
          <Dialog.Footer>
            <Button
              size='large'
              display='block'
              onClick={props.onWriteEvaluation}
            >
              평가표 작성하기
            </Button>
          </Dialog.Footer>
        </>
      )}
    </Dialog>
  );
}
