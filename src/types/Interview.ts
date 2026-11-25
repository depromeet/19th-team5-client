export type FeedbackDraft = {
  strengths: string[];
  improvements: string[];
  comment: string;
};

export type KeywordGroup = 'strengths' | 'improvements';
export type KeywordOption = {
  value: string;
  label: string;
  exclusive?: boolean;
};
export type FeedbackCandidate = {
  id: string;
  label: string;
  name: string;
  imageUrl: string | null;
  memos: { part: string; title: string; body: string }[];
};
export type InterviewFeedback = {
  candidates: FeedbackCandidate[];
  keywords: Record<KeywordGroup, KeywordOption[]>;
  scheduleLabel: string;
  durationMinutes: number;
  deadline: number;
  drafts: Record<string, FeedbackDraft>;
  submittedIds: string[];
};
export type ReceivedKeyword = {
  label: string;
  positive: boolean;
  count: number;
  icon: 'example' | 'delivery' | 'improvement';
};
export type QuestionGroup = {
  label: string;
  questions: { title: string; intent: string; guide: string }[];
};
export type ReceivedReview = {
  viewer: { ticketCount: number; hasUnreadNotifications: boolean };
  keywords: ReceivedKeyword[];
  comments: { id: string; author: string; text: string }[];
  questionGroups: QuestionGroup[];
  scheduleLabel: string;
  levelLabel: string;
};

export type InterviewDataSource = {
  getReceivedReview: () => Promise<ReceivedReview>;
  getFeedback: () => Promise<InterviewFeedback>;
  saveFeedback: (drafts: Record<string, FeedbackDraft>) => Promise<void>;
  submitFeedback: (input: {
    candidateId: string;
    drafts: Record<string, FeedbackDraft>;
  }) => Promise<InterviewFeedback>;
};
