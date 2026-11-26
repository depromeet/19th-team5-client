/** 면접은 1부 공통 질문 → 2부 커스텀 질문 → 3부 자유 질문 순서로 진행한다. */
export type InterviewPart = 'common' | 'custom' | 'free';

/**
 * 면접방 단계. seating은 면접자가 들어와 자리에 앉기 전, finished는 면접이 끝난 뒤다.
 * 면접관은 미리 앉아 있으므로 seating 없이 1부부터 시작한다.
 */
export type InterviewRoomStage = 'seating' | InterviewPart | 'finished';
