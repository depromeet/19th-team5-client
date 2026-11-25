import type { KeyboardEvent } from 'react';
import { Tabs } from '@/components/common/tabs';
import type { FeedbackCandidate } from '@/types/Interview';
import * as styles from '../FeedbackPage.css';

export function FeedbackCandidateTabs({
  candidates,
  activeId,
  submittedIds,
  disabled,
  panelId,
  onSelect,
}: {
  candidates: FeedbackCandidate[];
  activeId: string;
  submittedIds: string[];
  disabled: boolean;
  panelId: string;
  onSelect: (id: string) => void;
}) {
  function selectWithKeyboard(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const last = candidates.length - 1;
    let target: number;
    switch (event.key) {
      case 'ArrowLeft':
        target = index === 0 ? last : index - 1;
        break;
      case 'ArrowRight':
        target = index === last ? 0 : index + 1;
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [target]?.focus();
    onSelect(candidates[target].id);
  }

  return (
    <Tabs className={styles.tabs} aria-label='평가할 면접자'>
      {candidates.map((candidate, index) => {
        const selected = activeId === candidate.id;
        return (
          <Tabs.Item
            key={candidate.id}
            id={`${panelId}-tab-${index}`}
            aria-controls={panelId}
            selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={disabled}
            onClick={() => onSelect(candidate.id)}
            onKeyDown={(event) => selectWithKeyboard(event, index)}
          >
            {candidate.label}
            {submittedIds.includes(candidate.id) && ' ✓'}
          </Tabs.Item>
        );
      })}
    </Tabs>
  );
}
