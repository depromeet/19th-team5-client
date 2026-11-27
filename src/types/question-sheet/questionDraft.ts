export type QuestionDraft = {
  id: string;
  text: string;
  intent: string;
  answerGuide: string;
};

export type QuestionPatch = Partial<Omit<QuestionDraft, 'id'>>;
