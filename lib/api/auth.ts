import { LoginOtpResponse, LoginResponse, MessageResponse, RegisterResponse, ResetPasswordResponse, ResetPasswordOtpResponse } from '../types/api';
import { api, clearTokens, saveTokens } from './client';

export const AuthService = {
  /**
   * Step 1: Login with email + password.
   * Backend always sends an OTP to the user's email.
   * Returns id_token and otp_exp needed for step 2.
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    return api.post<LoginResponse>('/api/auth/login', { email, password }, false);
  },

  /**
   * Step 2: Verify OTP to complete login.
   * Returns JWT access and refresh tokens.
   */
  async verifyLoginOtp(
    id_token: string,
    otp: string,
    otp_exp: number,
    email: string,
  ): Promise<LoginOtpResponse> {
    const tokens = await api.post<LoginOtpResponse>(
      '/api/auth/login/otp',
      { id_token, otp, otp_exp, email },
      false,
    );
    await saveTokens(tokens);
    return tokens;
  },

  /**
   * Register a new account with email + password.
   * Backend sends an OTP to the email for verification.
   * Returns id_token and otp_exp for OTP verification step.
   */
  async register(email: string, password: string): Promise<RegisterResponse> {
    return api.post<RegisterResponse>('/api/auth/register', { email, password }, false);
  },

  /**
   * Verify registration OTP to activate the account.
   */
  async verifyRegistrationOtp(
    id_token: string,
    otp: string,
    otp_exp: number,
    email: string,
  ): Promise<MessageResponse> {
    return api.post<MessageResponse>(
      '/api/auth/register/otp',
      { id_token, otp, otp_exp, email },
      false,
    );
  },

  /**
   * Refresh the access token using the refresh token.
   */
  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    return api.post<{ access: string }>(
      '/api/auth/refresh_token',
      { refresh: refreshToken },
      false,
    );
  },

  /**
   * Step 1: Request password reset. Sends OTP to email.
   */
  async requestPasswordReset(email: string): Promise<ResetPasswordResponse> {
    return api.post<ResetPasswordResponse>('/api/auth/password/reset', { email }, false);
  },

  /**
   * Step 2: Verify reset password OTP.
   * Returns reset_token + reset_exp for the confirm step.
   */
  async verifyResetOtp(
    id_token: string,
    otp: string,
    otp_exp: number,
    email: string,
  ): Promise<ResetPasswordOtpResponse> {
    return api.post<ResetPasswordOtpResponse>(
      '/api/auth/password/reset/otp',
      { id_token, otp, otp_exp, email },
      false,
    );
  },

  /**
   * Step 3: Set new password after OTP verification.
   */
  async resetPassword(
    reset_token: string,
    reset_exp: number,
    email: string,
    new_password: string,
  ): Promise<MessageResponse> {
    return api.post<MessageResponse>(
      '/api/auth/password/reset/confirm',
      { reset_token, reset_exp, email, new_password },
      false,
    );
  },

  /**
   * Logout: invalidate session on backend, then clear local tokens.
   */
  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout', {}, true);
    } catch {
      // If logout API fails (expired token, etc.), still clear local tokens
    }
    await clearTokens();
  },
};
