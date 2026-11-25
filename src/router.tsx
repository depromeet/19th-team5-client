import { createBrowserRouter } from 'react-router';
import { HomePage } from '@/pages/home/HomePage';
import { LobbyPage } from '@/pages/lobby/LobbyPage';
import { WaitingRoomPage } from '@/pages/waiting-room/WaitingRoomPage';

export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  { path: '/lobby', Component: LobbyPage },
  {
    path: '/interviews/:interviewId/waiting-room',
    Component: WaitingRoomPage,
  },
]);
