import { expect, test } from '@playwright/test';
import { formatInputValue } from '../src/utils/FormatInput.ts';

test('숫자와 구분자가 섞인 입력을 날짜·시간·국내 전화번호로 표시한다', () => {
  for (const [format, raw, expected] of [
    ['month', '202603', '2026.03'],
    ['date', '2026-11-25', '2026.11.25'],
    ['date', '2026112', '2026.11.2'],
    ['time', '０９３０', '09:30'],
    ['time', '093', '09:3'],
    ['phone', '010 1234 5678', '010-1234-5678'],
    ['phone', '021234567', '02-123-4567'],
    ['phone', '02-1234-5678', '02-1234-5678'],
    ['phone', '0311234567', '031-123-4567'],
    ['phone', '050712345678', '0507-1234-5678'],
    ['phone', '15881234', '1588-1234'],
    ['phone', '010-', '010'],
    ['month', '', ''],
  ] as const) {
    expect(formatInputValue(raw, format)).toBe(expected);
    expect(formatInputValue(expected, format)).toBe(expected);
  }
});
