import { createBrowserRouter } from 'react-router';
import { HomePage } from '@/pages/HomePage';
import { InterviewLoadState } from '@/pages/interview/components/InterviewLoadState';

export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  {
    path: '/write-review',
    lazy: {
      Component: async () =>
        (await import('@/pages/interview/feedback/FeedbackPage')).FeedbackPage,
    },
    HydrateFallback: InterviewLoadState,
  },
  {
    path: '/received-review',
    lazy: {
      Component: async () =>
        (await import('@/pages/interview/received-review/ReceivedReviewPage'))
          .ReceivedReviewPage,
    },
    HydrateFallback: InterviewLoadState,
  },
]);
