export type ResumeAnswer = { question: string; answer: string };

/** 면접관이 2부 질문을 만들 때 보는 면접자 서류 */
export type Candidate = {
  id: string;
  label: string;
  summary: string;
  resume: readonly ResumeAnswer[];
};
