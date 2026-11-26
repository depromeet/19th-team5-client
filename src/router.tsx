import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, Navigate, useLocation } from 'react-router';
import { ReviewLoadState } from '@/components/review/ReviewLoadState';
import { HomePage } from '@/pages/home/HomePage';
import { LobbyPage } from '@/pages/lobby/LobbyPage';
import { AvatarSelectionPage } from '@/pages/signup/avatar/AvatarSelectionPage';
import { VisitorPassPage } from '@/pages/signup/pass/VisitorPassPage';
import { ResumeEditorPage } from '@/pages/signup/resume/ResumeEditorPage';
import { ResumeGuidePage } from '@/pages/signup/resume-guide/ResumeGuidePage';
import { SignupLayout } from '@/pages/signup/SignupLayout';
import { WaitingRoomPage } from '@/pages/waiting-room/WaitingRoomPage';
import { queryClient } from '@/queries/queryClient';

function SignupIndexRedirect() {
  const { search, hash, state } = useLocation();
  return (
    <Navigate to={{ pathname: 'avatar', search, hash }} state={state} replace />
  );
}

export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  {
    path: '/signup',
    element: (
      <QueryClientProvider client={queryClient}>
        <SignupLayout />
      </QueryClientProvider>
    ),
    children: [
      { index: true, Component: SignupIndexRedirect },
      { path: 'avatar', Component: AvatarSelectionPage },
      { path: 'resume-guide', Component: ResumeGuidePage },
      { path: 'resume', Component: ResumeEditorPage },
      { path: 'pass', Component: VisitorPassPage },
    ],
  },
  { path: '/lobby', Component: LobbyPage },
  {
    path: '/interviews/:interviewId/waiting-room',
    Component: WaitingRoomPage,
  },
  {
    path: '/write-review',
    lazy: async () => {
      const { FeedbackPage, loader } = await import(
        '@/pages/write-review/FeedbackPage'
      );
      return { Component: FeedbackPage, loader };
    },
    HydrateFallback: ReviewLoadState,
  },
  {
    path: '/received-review',
    lazy: {
      Component: async () =>
        (await import('@/pages/received-review/ReceivedReviewPage'))
          .ReceivedReviewPage,
    },
    HydrateFallback: ReviewLoadState,
  },
]);
