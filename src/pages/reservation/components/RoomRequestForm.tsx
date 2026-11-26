import { useState } from 'react';
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
import { useNow } from '@/hooks/common/useNow';
import {
  remainingRequests,
  useReservationStore,
} from '@/stores/reservation/reservationStore';
import type { RoomRequestDraft } from '@/types/reservation';
import {
  formatRoomDate,
  hourLabel,
  nextRequestWeek,
  reasonLimit,
  requestHours,
  requestJobs,
  validRoomRequest,
  weeklyRequestLimit,
} from '@/utils/reservation';
import * as styles from '../reservation.css';

type RequestResult = 'submitted' | 'limit' | null;

const emptyDraft: RoomRequestDraft = {
  title: '',
  job: '',
  hour: null,
  reason: '',
};

export function RoomRequestForm() {
  const navigate = useNavigate();
  const now = useNow();
  const requests = useReservationStore((state) => state.requests);
  const requestRoom = useReservationStore((state) => state.requestRoom);
  const [draft, setDraft] = useState(emptyDraft);
  const [result, setResult] = useState<RequestResult>(null);
  const remaining = remainingRequests(requests, now);
  const quotaReached = remaining === 0;
  const time = draft.hour === null ? '미선택' : hourLabel(draft.hour);
  const close = () => {
    if (result === 'submitted') setDraft(emptyDraft);
    setResult(null);
  };
  return (
    <>
      <form
        className={styles.columns}
        onSubmit={(event) => {
          event.preventDefault();
          const response = requestRoom(draft);
          if (response !== 'invalid') setResult(response);
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
            onChange={(event) =>
              setDraft({ ...draft, title: event.target.value })
            }
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
                  onChange={() => setDraft({ ...draft, hour })}
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
                  onChange={() => setDraft({ ...draft, job })}
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
            onChange={(event) =>
              setDraft({ ...draft, reason: event.target.value })
            }
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
          <div className={styles.stack}>
            {quotaReached ? (
              <Button size='large' onClick={() => setResult('limit')}>
                요청 한도 확인
              </Button>
            ) : (
              <Button
                type='submit'
                size='large'
                disabled={!validRoomRequest(draft)}
              >
                {draft.hour !== null && draft.job
                  ? `${time} · ${draft.job} 방 요청하기`
                  : '방 요청하기'}
              </Button>
            )}
            <Button
              size='large'
              variant='outline'
              onClick={() => navigate(reservationPaths.rooms)}
            >
              열린 면접방 보기
            </Button>
          </div>
        </aside>
      </form>
      <Dialog
        className={styles.dialog}
        isOpen={result !== null}
        onCancel={close}
      >
        <Dialog.Header>
          {result === 'limit'
            ? '이번 주 요청권은 여기까지'
            : '개설 요청을 접수했어요'}
        </Dialog.Header>
        <Dialog.Description>
          {result === 'limit'
            ? '개설 요청은 일주일에 2번까지 할 수 있어요.'
            : `${draft.title.trim()} · ${time} · ${draft.job}`}
        </Dialog.Description>
        <Dialog.Body className={styles.info}>
          {result === 'limit'
            ? `다음 요청 가능 시간은 ${formatRoomDate(nextRequestWeek(now))} 0시예요.`
            : '방이 열린 후 참여할 역할을 선택해 주세요.'}
        </Dialog.Body>
        <Dialog.Footer>
          <Button display='block' variant='secondary' onClick={close}>
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
