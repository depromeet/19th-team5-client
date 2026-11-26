import { useId } from 'react';
import { Button } from '@/components/common/button';
import { PageHeading } from '@/components/review/PageHeading';
import * as styles from '@/components/review/Review.css';
import type { InterviewFeedback } from '@/types/Interview';
import { useFeedbackEditor } from '../hooks/useFeedbackEditor';
import { FeedbackCandidateTabs } from './FeedbackCandidateTabs';
import { FeedbackExitDialog } from './FeedbackExitDialog';
import { FeedbackFields } from './FeedbackFields';
import { FeedbackSubmitDialog } from './FeedbackSubmitDialog';
import { FeedbackSummary } from './FeedbackSummary';

export function FeedbackEditor({ sheet }: { sheet: InterviewFeedback }) {
  const editor = useFeedbackEditor(sheet);
  const panelId = useId();
  const { candidates } = sheet;
  const candidateIndex = candidates.indexOf(editor.candidate);
  const notice = editor.notice;

  return (
    <main className={styles.layout}>
      <article className={styles.sheet} ref={editor.sheetRef}>
        <PageHeading title='오늘의 면접자, 어땠나요?'>
          면접자마다 키워드와 한 줄 평을 작성해 제출해 주세요.
        </PageHeading>
        <FeedbackCandidateTabs
          candidates={candidates}
          activeId={editor.candidate.id}
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
            disabled={editor.expired}
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
        />
        <div className={styles.card}>
          <Button
            variant='secondary'
            size='large'
            disabled={editor.expired}
            onClick={() => editor.saveDraft('save')}
          >
            임시 저장
          </Button>
          <Button
            size='large'
            disabled={editor.submitDisabled}
            onClick={editor.submit}
          >
            제출하기
          </Button>
          {notice && !editor.showDialog && (
            <p
              role={notice.tone === 'error' ? 'alert' : 'status'}
              className={notice.tone === 'error' ? styles.error : styles.status}
            >
              {notice.text}
            </p>
          )}
        </div>
      </aside>
      {editor.showDialog && (
        <FeedbackExitDialog
          expired={editor.expired}
          store={editor.store}
          durationMinutes={sheet.durationMinutes}
          error={notice?.tone === 'error' ? notice.text : undefined}
          onContinue={editor.resetExit}
          onLeave={() => editor.saveDraft('leave')}
          onAcknowledge={editor.acknowledgeExpiry}
        />
      )}
      {editor.isSubmitDialogOpen && !editor.showDialog && (
        <FeedbackSubmitDialog
          submitted={editor.candidate}
          remaining={candidates.filter(
            ({ id }) => !editor.submittedIds.has(id),
          )}
          onContinue={editor.continueWriting}
          onLeave={editor.leaveToLobby}
        />
      )}
    </main>
  );
}
