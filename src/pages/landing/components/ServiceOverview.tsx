import * as styles from '../HomePage.css';
import { SectionTitle } from './SectionTitle';

const services = [
  {
    name: '방문 출입증 발급',
    description: '아바타를 고르면 출입증이 나와요.\n자소서는 선택이에요.',
  },
  {
    name: '10분씩 3부 면접',
    description:
      '공통 질문 · 커스텀 질문 · 자유 질문을 10분씩 진행해요.\n커스텀 질문은 건너뛸 수 있어서 최소 20분이에요.',
  },
  {
    name: '피드백 받기',
    description: '면접관이 체크한 키워드와 한 줄 평이 기록에 쌓여요.',
  },
];

export function ServiceOverview() {
  return (
    <section id='service'>
      <div className={styles.container}>
        <SectionTitle
          label='서비스 소개'
          title='출입증을 받고, 면접 보고, 평가표를 받아요'
        />
        <ol className={styles.serviceGrid}>
          {services.map((service, index) => (
            <li className={styles.serviceCard} key={service.name}>
              <p className={styles.eyebrow}>0{index + 1}</p>
              <h3 className={styles.cardTitle}>{service.name}</h3>
              <p className={styles.cardDescription}>{service.description}</p>
              <div className={styles.serviceIllustration} aria-hidden='true' />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
