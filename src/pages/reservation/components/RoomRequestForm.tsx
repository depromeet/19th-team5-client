import { useNavigate } from 'react-router';
import {
  Button,
  Dialog,
  Radio,
  Tag,
  TextArea,
  TextField,
} from '@/components/common';
import { reservationPaths } from '@/constants/common/paths';
import { useRoomRequest } from '@/hooks/reservation/useRoomRequest';
import {
  formatRoomDate,
  hourLabel,
  reasonLimit,
  requestHours,
  requestJobs,
  weeklyRequestLimit,
} from '@/utils/reservation';
import * as styles from '../reservation.css';

export function RoomRequestForm() {
  const navigate = useNavigate();
  const {
    draft,
    updateDraft,
    pending,
    result,
    remaining,
    nextRequestAt,
    canSubmit,
    submit,
    showLimit,
    closeResult,
  } = useRoomRequest();
  const quotaReached = remaining === 0;
  const time = draft.hour === null ? '미선택' : hourLabel(draft.hour);

  return (
    <>
      <form
        className={styles.columns}
        aria-busy={pending}
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <section className={styles.form}>
          <header>
            <h2 className={styles.sectionTitle}>
              원하는 시간, 방 열어달라고 해요
            </h2>
            <p className={styles.muted}>
              시간대와 직군을 선택해 주세요. 방이 열리면 알려드려요.
            </p>
          </header>
          <TextField
            required
            label='방제'
            placeholder='디자인 직무 면접'
            value={draft.title}
            onChange={(event) => updateDraft({ title: event.target.value })}
          />
          <fieldset className={styles.field}>
            <legend className={styles.legend}>시간대 선택 (필수)</legend>
            <div className={styles.chips}>
              {requestHours.map((hour) => (
                <Radio
                  key={hour}
                  name='request-hour'
                  required
                  checked={draft.hour === hour}
                  onChange={() => updateDraft({ hour })}
                >
                  {hourLabel(hour)}
                </Radio>
              ))}
            </div>
          </fieldset>
          <fieldset className={styles.field}>
            <legend className={styles.legend}>직군 선택 (필수)</legend>
            <div className={styles.chips}>
              {requestJobs.map((job) => (
                <Radio
                  key={job}
                  name='request-job'
                  required
                  checked={draft.job === job}
                  onChange={() => updateDraft({ job })}
                >
                  {job}
                </Radio>
              ))}
            </div>
          </fieldset>
          <TextArea
            required
            label='개설 요청 이유'
            placeholder='어떤 면접을 연습하고 싶은지 알려주세요.'
            maxLength={reasonLimit}
            value={draft.reason}
            helperText={
              draft.reason.length > reasonLimit
                ? '100자 이내로 입력해 주세요.'
                : undefined
            }
            onChange={(event) => updateDraft({ reason: event.target.value })}
          />
          <div className={styles.info}>
            <strong>요청한 방이 열리면 알림으로 알려드려요</strong>
            <p className={styles.muted}>
              알림에서 면접방으로 이동해 남은 역할을 확인하고 예약해 주세요.
            </p>
          </div>
        </section>
        <aside className={styles.bordered}>
          <h2 className={styles.sectionTitle}>선택한 요청</h2>
          <dl className={styles.facts}>
            <dt>시간대</dt>
            <dd className={styles.value}>{time}</dd>
            <dt>직군</dt>
            <dd className={styles.value}>{draft.job || '미선택'}</dd>
          </dl>
          <div className={styles.info}>
            <div>
              <Tag tone={quotaReached ? 'gray' : 'green'}>
                이번 주 {remaining}회 남음
              </Tag>
            </div>
            <p className={styles.muted}>
              개설 요청은 주 {weeklyRequestLimit}회까지 가능해요.
            </p>
          </div>
          {quotaReached ? (
            <Button size='large' display='block' onClick={showLimit}>
              요청 한도 확인
            </Button>
          ) : (
            <Button
              type='submit'
              size='large'
              display='block'
              disabled={!canSubmit}
            >
              {draft.hour !== null && draft.job
                ? `${time} · ${draft.job} 방 요청하기`
                : '방 요청하기'}
            </Button>
          )}
        </aside>
      </form>
      <Dialog
        className={styles.dialog}
        isOpen={result !== null}
        onCancel={closeResult}
      >
        <Dialog.Header>
          {result === 'error'
            ? '개설 요청을 저장하지 못했어요'
            : result === 'limit'
              ? '이번 주 요청권은 여기까지'
              : '개설 요청을 접수했어요'}
        </Dialog.Header>
        <Dialog.Description>
          {result === 'error'
            ? '다시 시도해 주세요.'
            : result === 'limit'
              ? `개설 요청은 일주일에 ${weeklyRequestLimit}번까지 할 수 있어요.`
              : `${draft.title.trim()} · ${time} · ${draft.job}`}
        </Dialog.Description>
        {result !== 'error' && (
          <Dialog.Body className={styles.info}>
            {result === 'limit'
              ? `다음 요청 가능 시간은 ${formatRoomDate(nextRequestAt)} 0시예요.`
              : '방이 열린 후 참여할 역할을 선택해 주세요.'}
          </Dialog.Body>
        )}
        <Dialog.Footer>
          <Button display='block' variant='secondary' onClick={closeResult}>
            닫기
          </Button>
          <Button
            display='block'
            onClick={() => navigate(reservationPaths.rooms)}
          >
            열린 방 보기
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}
