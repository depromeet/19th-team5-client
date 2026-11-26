import { useNavigate } from 'react-router';
import { Button, Tabs } from '@/components/common';
import { reservationPaths } from '@/constants/common/paths';
import { RoomList } from './components/RoomList';
import { RoomRequestForm } from './components/RoomRequestForm';
import * as styles from './reservation.css';

type ReservationPageProps = { request?: boolean };

export function ReservationPage({ request = false }: ReservationPageProps) {
  const navigate = useNavigate();
  return (
    <>
      <header>
        <h1 className={styles.heading}>오늘, 어떤 면접을 해볼까요?</h1>
        <p className={styles.subtitle}>
          정해진 시간에 모여, 진짜 사람과 면접을 진행해요
        </p>
      </header>
      <section className={styles.panel}>
        <Tabs aria-label='면접 예약'>
          <Tabs.Item
            selected={!request}
            onClick={() => navigate(reservationPaths.rooms)}
          >
            면접방
          </Tabs.Item>
          <Tabs.Item
            selected={request}
            onClick={() => navigate(reservationPaths.request)}
          >
            개설 요청
          </Tabs.Item>
        </Tabs>
        {request ? <RoomRequestForm /> : <RoomList />}
      </section>
      {!request && (
        <aside className={styles.banner}>
          <div>
            <h2 className={styles.sectionTitle}>원하는 시간대가 없나요?</h2>
            <p className={styles.muted}>
              시간대와 직군을 남겨 주세요. 개설 요청은 주 2회까지 가능해요.
            </p>
          </div>
          <Button
            variant='text'
            onClick={() => navigate(reservationPaths.request)}
          >
            개설 요청하기
          </Button>
        </aside>
      )}
    </>
  );
}
