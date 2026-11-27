import { useSearchParams } from 'react-router';

const roles = ['interviewee', 'interviewer'] as const;
const phases = ['prepare', 'open'] as const;

function pick<Option extends string>(
  value: string | null,
  options: readonly Option[],
  fallback: Option,
) {
  return options.find((option) => option === value) ?? fallback;
}

/**
 * 프로토타입은 예약 API 대신 URL 쿼리로 역할과 단계를 정한다.
 * 예) /lobby?role=interviewer&phase=open
 */
export function usePrototypeParams() {
  const [searchParams] = useSearchParams();
  const role = pick(searchParams.get('role'), roles, 'interviewee');
  return {
    role,
    phase: pick(searchParams.get('phase'), phases, 'prepare'),
    isTask3: role === 'interviewee' && searchParams.get('task') === '3',
  };
}
