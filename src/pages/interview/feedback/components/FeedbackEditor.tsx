import { useId } from 'react';
import { Button } from '@/components/common/button';
import type { InterviewFeedback } from '@/types/Interview';
import { PageHeading } from '../../components/PageHeading';
import * as styles from '../../Interview.css';
import { useFeedbackEditor } from '../hooks/useFeedbackEditor';
import { FeedbackCandidateTabs } from './FeedbackCandidateTabs';
import { FeedbackExitDialog } from './FeedbackExitDialog';
import { FeedbackFields } from './FeedbackFields';
import { FeedbackSummary } from './FeedbackSummary';

export function FeedbackEditor({ sheet }: { sheet: InterviewFeedback }) {
  const editor = useFeedbackEditor(sheet);
  const panelId = useId();
  const { candidates, submittedIds } = sheet;
  const candidateIndex = candidates.indexOf(editor.candidate);
  const notice = editor.notice;

  return (
    <main className={styles.layout} aria-busy={editor.pending || undefined}>
      <article className={styles.sheet} ref={editor.sheetRef}>
        <PageHeading title='오늘의 면접자, 어땠나요?'>
          점수 대신 키워드로 전해요. 피드백은 해당 면접자만 볼 수 있어요.
        </PageHeading>
        <FeedbackCandidateTabs
          candidates={candidates}
          activeId={editor.candidate.id}
          submittedIds={submittedIds}
          disabled={editor.pending}
          panelId={panelId}
          onSelect={editor.select}
        />
        <div
          role='tabpanel'
          id={panelId}
          aria-labelledby={`${panelId}-tab-${candidateIndex}`}
        >
          <FeedbackFields
            feedback={editor.feedback}
            keywords={sheet.keywords}
            disabled={editor.locked}
            commentError={editor.commentError}
            invalidGroups={{
              strengths: editor.attempted && editor.needsStrengths,
              improvements: editor.attempted && editor.needsImprovements,
            }}
            onChange={editor.edit}
          />
        </div>
      </article>
      <aside className={styles.side}>
        <FeedbackSummary
          candidate={editor.candidate}
          scheduleLabel={sheet.scheduleLabel}
          store={editor.store}
          completed={submittedIds.length}
          total={candidates.length}
        />
        <div className={styles.card}>
          <Button
            variant='secondary'
            size='large'
            disabled={editor.locked}
            onClick={() => editor.saveOrSubmit('save')}
          >
            임시 저장
          </Button>
          <Button
            size='large'
            disabled={editor.submitDisabled}
            onClick={() => editor.saveOrSubmit('submit')}
          >
            {editor.submitted ? '제출 완료' : '제출하기'}
          </Button>
          {editor.complete ? (
            <p role='status' className={styles.status}>
              모든 면접자의 평가를 제출했어요.
            </p>
          ) : notice && !editor.showDialog ? (
            <p
              role={notice.tone === 'error' ? 'alert' : 'status'}
              className={notice.tone === 'error' ? styles.error : styles.status}
            >
              {notice.text}
            </p>
          ) : null}
        </div>
      </aside>
      {editor.showDialog && (
        <FeedbackExitDialog
          expired={editor.expired}
          store={editor.store}
          durationMinutes={sheet.durationMinutes}
          completed={submittedIds.length}
          total={candidates.length}
          pending={editor.pending}
          error={notice?.tone === 'error' ? notice.text : undefined}
          onContinue={editor.resetExit}
          onLeave={() => editor.saveOrSubmit('leave')}
          onAcknowledge={editor.acknowledgeExpiry}
        />
      )}
    </main>
  );
}
