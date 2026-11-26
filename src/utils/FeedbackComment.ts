import Filter from 'badwords-ko';

let filter: Filter | undefined;
export const commentLimit = 100;

export function getFeedbackCommentError(comment: string) {
  if (comment.length > commentLimit) {
    return `한 줄 평은 ${commentLimit}자 이내로 작성해주세요.`;
  }
  if (!comment) return undefined;
  filter ??= new Filter({ list: ['멍청이'] });
  if (filter.isProfane(comment.normalize('NFC'))) {
    return '부적절한 표현이 포함되어 있어요. 상대의 연습에 도움이 되는 말로 수정해주세요.';
  }
}
