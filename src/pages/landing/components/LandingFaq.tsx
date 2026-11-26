import { container } from '../HomePage.css';
import * as styles from './LandingFaq.css';

const questions = [
  {
    question: '왜 메타버스인가요? 그냥 화상으로 하면 안 되나요?',
    answer:
      '얼굴을 드러내는 부담 없이, 그래도 “자리에 앉아 면접관과 마주한 느낌”을 만들기 위해서예요. 시간대에 맞춰 방이 열리고 질문 카드·타이머·기록이 자동으로 진행돼서, 진행자를 따로 구할 필요도 없어요.',
  },
  {
    question: '익명인데 자소서·이력은 어떻게 쓰나요?',
    answer:
      '아바타와 닉네임으로 참여해요. 이력서에 경험을 적으면 면접관이 그 내용을 읽고 질문을 준비해요. 이력서 작성은 건너뛸 수 있어요.',
  },
  {
    question: '면접권이 없으면 면접을 못 보나요?',
    answer:
      '면접자로 예약하려면 면접권 1장이 필요해요. 가입하면 2장을 받고, 면접관으로 참여할 때마다 1장을 받아요.',
  },
  {
    question: '예약하고 못 가면 어떻게 되나요?',
    answer:
      '예약한 면접에 불참한 횟수는 출입증의 ‘노쇼 경고’에서 확인할 수 있어요.',
  },
];

export function LandingFaq() {
  return (
    <section>
      <div className={container}>
        <h2 className={styles.faqTitle}>자주 묻는 질문</h2>
        {questions.map(({ question, answer }, index) => (
          <details
            className={styles.question}
            key={question}
            name='landing-faq'
            open={index === 0}
          >
            <summary className={styles.summary}>{question}</summary>
            <p className={styles.answer}>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
