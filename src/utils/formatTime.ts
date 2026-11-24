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

/**
 * 초를 `<time dateTime>`에 쓰는 ISO 8601 duration 문자열로 만든다.
 * @example toDurationString(75) // 'PT1M15S'
 */
export function toDurationString(totalSeconds: number) {
  const { minutes, seconds } = splitSeconds(totalSeconds);
  return `PT${minutes}M${seconds}S`;
}
