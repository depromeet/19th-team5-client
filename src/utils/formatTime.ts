const pad = (value: number) => String(value).padStart(2, '0');

/** 초를 0 이상의 정수로 정리한 뒤 분·초로 나눈다. */
function splitSeconds(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  return { minutes: Math.floor(safe / 60), seconds: safe % 60 };
}

/**
 * 초를 `mm:ss` 문자열로 만든다. 60분 이상이면 분이 그대로 늘어난다.
 * @example formatTime(75) // '01:15'
 * @example formatTime(4500) // '75:00'
 */
export function formatTime(totalSeconds: number) {
  const { minutes, seconds } = splitSeconds(totalSeconds);
  return `${pad(minutes)}:${pad(seconds)}`;
}

/** 예약처럼 한 시간 이상 남을 수 있는 카운트다운은 h:mm:ss로 표시한다. */
export function formatCountdown(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  if (hours < 1) return formatTime(totalSeconds);
  return `${hours}:${formatTime(totalSeconds % 3600)}`;
}

/**
 * 초를 `<time dateTime>`에 쓰는 ISO 8601 duration 문자열로 만든다.
 * @example toDurationString(75) // 'PT1M15S'
 */
export function toDurationString(totalSeconds: number) {
  const { minutes, seconds } = splitSeconds(totalSeconds);
  return `PT${minutes}M${seconds}S`;
}

/**
 * 초를 "1분 30초"처럼 읽는 길이로 만든다. 0인 단위는 쓰지 않는다.
 * @example formatDurationLabel(600) // '10분'
 * @example formatDurationLabel(90) // '1분 30초'
 * @example formatDurationLabel(45) // '45초'
 */
export function formatDurationLabel(totalSeconds: number) {
  const { minutes, seconds } = splitSeconds(totalSeconds);
  if (minutes === 0) return `${seconds}초`;
  return seconds === 0 ? `${minutes}분` : `${minutes}분 ${seconds}초`;
}
