import * as styles from '../HomePage.css';
import { SectionTitle } from './SectionTitle';

const steps = [
  {
    image: 'booking',
    alt: '오늘의 면접방에서 20시 면접자 자리를 선택한 예시',
    title: '시간 맞춰 예약',
    description: '매일 오전 8시, 오늘의 면접방이 열려요',
  },
  {
    image: 'waiting-room',
    alt: '아바타 네 명 중 세 명이 준비를 마친 대기실 예시',
    title: '아바타로 입장',
    description: '1·2·3부 10분씩, 실전처럼',
  },
  {
    image: 'debrief',
    alt: '공통 질문과 받은 키워드, 내 답변이 함께 있는 복기 화면 예시',
    title: '가볍게 돌아보기',
    description: '질문 · 내 답변 · 키워드가 남아요',
  },
];

export function InterviewSteps() {
  return (
    <section id='how-it-works'>
      <div className={styles.container}>
        <SectionTitle
          label='이렇게 진행돼요'
          title='예약 → 입장 → 복기, 30분이면 끝'
        />
        <ol className={styles.stepGrid}>
          {steps.map((step, index) => (
            <li key={step.image} className={styles.step}>
              <img
                className={styles.stepImage}
                src={`/images/landing/${step.image}.webp`}
                alt={step.alt}
                width={392}
                height={320}
                loading='lazy'
              />
              <div>
                <p className={styles.stepLabel}>STEP 0{index + 1}</p>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.cardDescription}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
