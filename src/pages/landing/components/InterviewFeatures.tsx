import {
  IconChevronLeftLine,
  IconChevronRightLine,
} from '@karrotmarket/react-monochrome-icon';
import { type ReactNode, useState } from 'react';
import { Tag } from '@/components/common/tag';
import * as pageStyles from '../HomePage.css';
import * as styles from './InterviewFeatures.css';

type FeaturePreviewProps = {
  title: string;
  children: ReactNode;
};

const slides = [
  {
    label: '녹음',
    title: '답변은 그대로 녹음돼요',
    description:
      '말하는 동안 자동으로 녹음돼요.\n끝나고 내 답변을 다시 들어볼 수 있어요.',
    preview: (
      <img
        className={pageStyles.fluidImage}
        src='/images/landing/recording.webp'
        width={600}
        height={340}
        loading='lazy'
        alt='면접 질문에 답하며 1분 24초 동안 음성을 녹음 중인 화면 예시'
      />
    ),
  },
  {
    label: '키워드',
    title: '면접관이 고른 키워드가 도착해요',
    description:
      '내 답변에서 잘 전달된 점과 보완할 점을\n면접관이 고른 키워드로 확인해요.',
    preview: (
      <FeaturePreview title='받은 키워드'>
        <Tag>구체적인 사례 ×2</Tag>
        <Tag tone='outline'>결론이 늦어요</Tag>
      </FeaturePreview>
    ),
  },
  {
    label: '한 줄 평',
    title: '한 줄 평으로 돌아봐요',
    description:
      '면접관이 남긴 피드백을 읽고\n다음 면접에서 연습할 점을 찾아요.',
    preview: (
      <FeaturePreview title='면접관의 한 줄 평'>
        <blockquote>
          “도움을 요청한 과정과 배운 점을 잘 전달했어요. 다음에는 선택의 근거도
          함께 들려주세요.”
        </blockquote>
      </FeaturePreview>
    ),
  },
];

function FeaturePreview({ title, children }: FeaturePreviewProps) {
  return (
    <div className={styles.preview}>
      <strong>{title}</strong>
      <div className={styles.previewBody}>{children}</div>
    </div>
  );
}

export function InterviewFeatures() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  function changeSlide(delta: number) {
    setIndex((current) => (current + delta + slides.length) % slides.length);
  }
  return (
    <section className={styles.feature} aria-label='면접 기록 미리보기'>
      <div className={`${pageStyles.container} ${styles.featureGrid}`}>
        {slide.preview}
        <div className={styles.featureCopy}>
          <div aria-live='polite' aria-atomic='true'>
            <p className={styles.indexLabel}>
              0{index + 1} · {slide.label}
            </p>
            <h2 className={pageStyles.title}>{slide.title}</h2>
            <p className={styles.featureDescription}>{slide.description}</p>
          </div>
          <div className={styles.controls}>
            <button
              type='button'
              className={styles.arrow}
              onClick={() => changeSlide(-1)}
              aria-label='이전 기능'
            >
              <IconChevronLeftLine size={16} aria-hidden='true' />
            </button>
            <button
              type='button'
              className={styles.arrow}
              onClick={() => changeSlide(1)}
              aria-label='다음 기능'
            >
              <IconChevronRightLine size={16} aria-hidden='true' />
            </button>
            <div className={styles.dots} aria-hidden='true'>
              {slides.map((item, i) => (
                <span
                  key={item.label}
                  className={styles.dot}
                  data-active={i === index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
