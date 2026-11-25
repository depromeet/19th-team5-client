import { createBrowserRouter } from 'react-router';
import { ReviewLoadState } from '@/components/review/ReviewLoadState';
import { HomePage } from '@/pages/HomePage';

export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
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
