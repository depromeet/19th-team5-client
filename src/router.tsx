import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router';
import { ReviewLoadState } from '@/components/review/ReviewLoadState';
import {
  ForgotPasswordPage,
  requestResetAction,
} from '@/pages/auth/ForgotPasswordPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import {
  ResetPasswordPage,
  resetPasswordAction,
} from '@/pages/auth/ResetPasswordPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { HomePage as PrototypeHomePage } from '@/pages/home/HomePage';
import { InterviewRoomPage } from '@/pages/interview-room/InterviewRoomPage';
import { HomePage } from '@/pages/landing/HomePage';
import { LobbyPage } from '@/pages/lobby/LobbyPage';
import { AvatarSelectionPage } from '@/pages/signup/avatar/AvatarSelectionPage';
import { VisitorPassPage } from '@/pages/signup/pass/VisitorPassPage';
import { ResumeEditorPage } from '@/pages/signup/resume/ResumeEditorPage';
import { ResumeGuidePage } from '@/pages/signup/resume-guide/ResumeGuidePage';
import { SignupLayout } from '@/pages/signup/SignupLayout';
import { WaitingRoomPage } from '@/pages/waiting-room/WaitingRoomPage';
import { queryClient } from '@/queries/queryClient';

export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  { path: '/prototype', Component: PrototypeHomePage },
  { path: '/login', Component: LoginPage },
  {
    path: '/forgot-password',
    Component: ForgotPasswordPage,
    action: requestResetAction,
  },
  {
    path: '/reset-password',
    Component: ResetPasswordPage,
    action: resetPasswordAction,
  },
  {
    path: '/signup',
    children: [
      { index: true, Component: SignupPage },
      {
        element: (
          <QueryClientProvider client={queryClient}>
            <SignupLayout />
          </QueryClientProvider>
        ),
        children: [
          { path: 'avatar', Component: AvatarSelectionPage },
          { path: 'resume-guide', Component: ResumeGuidePage },
          { path: 'resume', Component: ResumeEditorPage },
          { path: 'pass', Component: VisitorPassPage },
        ],
      },
    ],
  },
  {
    path: '/interviews/:interviewId/interview-room',
    Component: InterviewRoomPage,
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
