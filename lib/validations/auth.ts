import { z } from 'zod';

export const passwordSchema = z
    .string()
    .min(10, 'Password must be at least 10 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[\W_]/, 'Must contain at least one special character');

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export const verifyOtpSchema = z.object({
    code: z.string().length(6, 'Verification code must be 6 digits'),
});

export const requestPasswordResetSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

export const setNewPasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;
export type SetNewPasswordInput = z.infer<typeof setNewPasswordSchema>;
