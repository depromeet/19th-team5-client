export type AuthCredentials = { email: string; password: string };

export type AuthResult = 'success' | 'duplicate-email' | 'invalid-credentials';
export type PasswordResetTicket = {
  email: string;
  id: string;
  expiresAt: number;
};
export type PasswordResetResult =
  | 'success'
  | 'invalid-link'
  | 'invalid-password';

export type AuthOperation = (
  credentials: AuthCredentials,
  signal?: AbortSignal,
) => Promise<AuthResult>;
export type AuthDataSource = {
  signup: AuthOperation;
  login: AuthOperation;
  requestPasswordReset: (
    email: string,
    signal?: AbortSignal,
  ) => Promise<boolean>;
  resetPassword: (
    ticket: PasswordResetTicket,
    password: string,
    signal?: AbortSignal,
  ) => Promise<PasswordResetResult>;
  currentEmail: () => string | null;
  logout: () => void;
};
