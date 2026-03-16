import { createDefaultProfile, UserProfile } from '@/utils/userStore';
import {
    LoginInput,
    RequestPasswordResetInput,
    SetNewPasswordInput,
    SignUpInput,
    VerifyOtpInput
} from '../validations/auth';
import { ApiError, mockCall } from './client';

export interface AuthResponse {
    token: string;
    user: UserProfile;
    requires2FA?: boolean;
}

export const AuthService = {
    async login(data: LoginInput): Promise<AuthResponse> {
        await mockCall(null);

        if (data.identifier === 'maximus@rebank.com' || data.identifier === 'iam-raouf@rebank.com') {
            if (data.password === '12345678') {
                throw { message: 'Invalid credentials. Please try again.', status: 401 } as ApiError;
            }
        }

        const { getUserProfile } = await import('@/utils/userStore');
        const user = await getUserProfile();

        if (user.is2FAEnabled) {
            return {
                token: '',
                user,
                requires2FA: true,
            };
        }

        return {
            token: 'mock-jwt-token-xyz-123',
            user,
        };
    },

    async register(data: SignUpInput): Promise<{ message: string }> {
        await mockCall(null);
        return { message: 'Registration successful. Please verify your email.' };
    },

    async requestPasswordReset(data: RequestPasswordResetInput): Promise<{ message: string }> {
        await mockCall(null);
        if (data.email === 'notfound@example.com') {
            throw { message: 'No account found with this email.', status: 404 } as ApiError;
        }
        return { message: 'If an account exists, a reset code has been sent.' };
    },

    async verifyOtp(data: VerifyOtpInput, mode: 'password-reset' | 'account-verify' | '2fa-login'): Promise<{ valid: boolean, token?: string }> {
        await mockCall(null);
        if (data.code === '000000') {
            throw { message: 'Invalid verification code.', status: 400 } as ApiError;
        }
        return {
            valid: true,
            token: mode === 'password-reset' ? 'temp-reset-token-789' : 'mock-jwt-token-xyz-123'
        };
    },

    async setNewPassword(data: SetNewPasswordInput, token: string): Promise<{ message: string }> {
        await mockCall(null);
        return { message: 'Password has been successfully updated.' };
    }
};
