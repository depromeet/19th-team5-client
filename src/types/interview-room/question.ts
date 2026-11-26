/** 면접관이 질문 카드에서 보는 질문 */
export type QuestionCard = {
  id: string;
  /** 질문 분류. 예) 경험 질문, 커스텀 질문 */
  category: string;
  text: string;
  /** 이 질문으로 확인하려는 것 */
  intent: string;
};

/** 면접자 화면에 뜨는 질문. 면접관이 고른 질문이 면접자에게 공유된다. */
export type ReceivedQuestion = {
  text: string;
  /** 질문 순서나 종류. 예) 1 / 3, 꼬리질문 */
  detail: string;
  /** 질문한 면접관의 닉네임 */
  interviewerName: string;
};
