import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginOtpResponse, LoginResponse, MessageResponse, RegisterResponse, ResetPasswordResponse, ResetPasswordOtpResponse, UserProfileResponse } from '../types/api';
import { api, clearTokens, saveTokens } from './client';

const USER_EMAIL_KEY = '@rebank_user_email';

export async function getUserEmail(): Promise<string | null> {
  return AsyncStorage.getItem(USER_EMAIL_KEY);
}

export const AuthService = {
  /**
   * Step 1: Login with email + password.
   * If 2FA is enabled: returns id_token/otp_exp (OTP sent to email).
   * If 2FA is disabled: returns tokens directly (no OTP step needed).
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/auth/login', { email, password }, false);

    // 2FA disabled — save tokens immediately
    if (!response.two_factor_required && response.access_token && response.refresh_token) {
      await saveTokens({ access_token: response.access_token, refresh_token: response.refresh_token });
      await AsyncStorage.setItem(USER_EMAIL_KEY, email);
    }

    return response;
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
    await AsyncStorage.setItem(USER_EMAIL_KEY, email);
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
   * Get current user profile (email, name, 2FA status).
   */
  async getProfile(): Promise<UserProfileResponse> {
    return api.get<UserProfileResponse>('/api/auth/profile');
  },

  /**
   * Enable or disable 2FA for the authenticated user.
   */
  async toggle2FA(enabled: boolean): Promise<{ message: string; two_factor_enabled: boolean }> {
    return api.post<{ message: string; two_factor_enabled: boolean }>(
      '/api/auth/2fa/toggle',
      { enabled },
      true,
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
    await AsyncStorage.removeItem(USER_EMAIL_KEY);
  },
};
