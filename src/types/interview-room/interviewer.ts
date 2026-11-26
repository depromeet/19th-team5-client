/** 면접자가 면접이 끝난 뒤 좋아요를 보내는 면접관. 익명이라 아바타 별명으로 부른다. */
export type Interviewer = {
  id: string;
  name: string;
  /** 면접관 등급. 예) Lv.3 1차 합격자 */
  levelLabel: string;
  imageUrl: string;
};
