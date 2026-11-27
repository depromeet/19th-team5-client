import { useSearchParams } from 'react-router';
import { PrototypeLobby } from './PrototypeLobby';
import { ReservationLobby } from './ReservationLobby';

export function LobbyPage() {
  const [params] = useSearchParams();
  // 역할·단계 URL은 사용성 테스트의 프로토타입 예약을 사용한다.
  return params.has('role') || params.has('phase') ? (
    <PrototypeLobby />
  ) : (
    <ReservationLobby />
  );
}
