export type Avatar = 'boy' | 'girl';

export type SignupProfile = { avatar: Avatar; nickname: string };

export type SignupOption = { id: string; label: string };

export type ResumeExperience = {
  title: string;
  start: string;
  end: string;
  role: string;
  description: string;
};

export type ResumeAnswer = { questionId: string; text: string };

export type ResumeSubmission = {
  careerId: string;
  experiences: ResumeExperience[];
  answers: ResumeAnswer[];
  files: File[];
};

export type PassProgress = {
  level: number;
  interviewCount: number;
  ticketCount: number;
  noShowCount: number;
  noShowLimit: number;
};

export type PassLevel = { level: number; label: string; minInterviews: number };

export type SignupOptions = {
  careers: readonly SignupOption[];
  defaultCareerId: string;
  questions: readonly SignupOption[];
  previewJobLabel: string;
  navigation: { ticketCount: number; hasUnreadNotifications: boolean };
  passLevels: readonly PassLevel[];
  initialPassProgress: PassProgress;
};

export type SignupSubmission = SignupProfile & { resume?: ResumeSubmission };

export type IssuedPass = SignupProfile & {
  issuedAt: number;
  progress: PassProgress;
};

export type SignupDataSource = {
  getOptions: () => Promise<SignupOptions>;
  suggestNickname: (currentNickname: string) => Promise<string>;
  completeSignup: (submission: SignupSubmission) => Promise<IssuedPass>;
};
