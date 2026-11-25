import type { ChangeEvent } from 'react';

export type InputFormat = 'month' | 'date' | 'time' | 'phone';

function digitsOnly(value: string) {
  return value.normalize('NFKC').replace(/\D/g, '');
}

function groupDigits(digits: string, widths: number[], separator: string) {
  const groups: string[] = [];
  let offset = 0;
  for (const width of widths) {
    if (offset >= digits.length) break;
    groups.push(digits.slice(offset, offset + width));
    offset += width;
  }
  return groups.join(separator);
}

/** 입력 중인 숫자를 표시 형식으로 바꾼다. 전화번호는 국내 번호 기준이다. */
export function formatInputValue(value: string, format: InputFormat): string {
  const digits = digitsOnly(value);
  switch (format) {
    case 'month':
      return groupDigits(digits, [4, 2], '.');
    case 'date':
      return groupDigits(digits, [4, 2, 2], '.');
    case 'time':
      return groupDigits(digits, [2, 2], ':');
    case 'phone': {
      if (/^1[568]/.test(digits)) return groupDigits(digits, [4, 4], '-');
      const prefix = digits.startsWith('02')
        ? 2
        : digits.startsWith('050')
          ? 4
          : 3;
      const middle =
        digits.startsWith('010') || digits.length > prefix + 7 ? 4 : 3;
      return groupDigits(digits, [prefix, middle, 4], '-');
    }
  }
}

/** text/tel 입력의 onChange에서 호출하면 중간 편집 시에도 커서가 숫자를 따라간다. */
export function formatInputChange(
  event: ChangeEvent<HTMLInputElement>,
  format: InputFormat,
) {
  const input = event.currentTarget;
  const raw = input.value;
  const formatted = formatInputValue(raw, format);
  if (raw === formatted) return formatted;

  const beforeCaret = raw.slice(0, input.selectionStart ?? raw.length);
  let remaining = digitsOnly(beforeCaret).length;
  let caret = 0;
  while (remaining > 0 && caret < formatted.length) {
    if (/\d/.test(formatted[caret])) remaining--;
    caret++;
  }
  const deletingForward =
    'inputType' in event.nativeEvent &&
    event.nativeEvent.inputType === 'deleteContentForward';
  if (
    (deletingForward || /[.:/-]$/.test(beforeCaret)) &&
    /[.:-]/.test(formatted.charAt(caret))
  )
    caret++;
  input.value = formatted;
  input.setSelectionRange(caret, caret);
  return formatted;
}
