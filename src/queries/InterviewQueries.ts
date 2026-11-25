import { queryOptions } from '@tanstack/react-query';
import { interviewApi } from '@/apis/InterviewApi';

export const feedbackQuery = queryOptions({
  queryKey: ['interview', 'feedback'],
  queryFn: interviewApi.getFeedback,
  refetchOnWindowFocus: false,
});

export const receivedReviewQuery = queryOptions({
  queryKey: ['interview', 'received-review'],
  queryFn: interviewApi.getReceivedReview,
});
