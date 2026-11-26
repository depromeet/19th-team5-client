import { useAuthStore } from '@/stores/AuthStore';
import { updateSignupProgress } from '@/stores/signup/signupStorage';
import type {
  IssuedPass,
  SignupDataSource,
  SignupOptions,
} from '@/types/Signup';

const nicknames = [
  '차분한수달',
  '씩씩한토끼',
  '웃는펭귄',
  '당찬고래',
  '반짝여우',
  '느긋한곰',
];

const initialPassProgress = {
  level: 1,
  interviewCount: 0,
  ticketCount: 2,
  noShowCount: 0,
  noShowLimit: 2,
};

const signupOptions: SignupOptions = {
  careers: [
    { id: 'entry', label: '신입' },
    { id: 'one-to-three', label: '1–3년' },
    { id: 'three-plus', label: '3년 이상' },
  ],
  defaultCareerId: 'entry',
  questions: [
    { id: 'motivation', label: '지원 동기와 입사 후 포부' },
    { id: 'problem-solving', label: '문제를 해결한 경험' },
    { id: 'teamwork', label: '팀으로 협업한 경험' },
    { id: 'strength', label: '나의 강점을 발휘한 경험' },
    { id: 'weakness', label: '나의 약점과 이를 보완한 방법' },
    { id: 'failure', label: '실패한 경험에서 배운 점' },
    { id: 'conflict', label: '팀원과 의견 차이를 조율한 경험' },
    { id: 'goal', label: '도전적인 목표를 세우고 달성한 경험' },
    { id: 'preparation', label: '지원 직무를 위해 준비한 과정' },
    { id: 'values', label: '일할 때 가장 중요하게 생각하는 가치' },
  ],
  previewJobLabel: '디자인 · 신입',
  navigation: {
    ticketCount: initialPassProgress.ticketCount,
    hasUnreadNotifications: true,
  },
  passLevels: [
    { level: 1, label: '지원자', minInterviews: 0 },
    { level: 2, label: '서류 합격자', minInterviews: 3 },
    { level: 3, label: '1차 합격자', minInterviews: 8 },
    { level: 4, label: '최종 합격자', minInterviews: 15 },
    { level: 5, label: '면접 마스터', minInterviews: 30 },
  ],
  initialPassProgress,
};

export const signupMock: SignupDataSource = {
  async getOptions() {
    return signupOptions;
  },
  async suggestNickname(currentNickname) {
    const available = nicknames.filter(
      (nickname) => nickname !== currentNickname,
    );
    return available[Math.floor(Math.random() * available.length)];
  },
  async completeSignup({ avatar, nickname, resume }) {
    const { email } = useAuthStore.getState();
    if (!email) throw new Error('로그인 정보가 없어요.');
    const pass: IssuedPass = {
      avatar,
      nickname,
      issuedAt: Date.now(),
      progress: { ...initialPassProgress },
    };
    const progress = await updateSignupProgress(email, (current) =>
      current.pass ? {} : { avatar: { avatar, nickname }, pass, resume },
    );
    return progress.pass ?? pass;
  },
};
