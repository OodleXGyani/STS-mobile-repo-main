import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().trim().min(2, 'Username must be at least 2 characters'),
    password: z.string().trim().min(8, 'Password must be at least 8 characters'),
});

export const userSettingsSchema = z.object({
    name: z
        .string()
        .trim()
        .nonempty('Name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: z
        .string()
        .trim()
        .nonempty('Email is required')
        .email('Invalid email'),
    mobile: z
        .string()
        .trim()
        .nonempty('Phone number is required')
        .regex(/^[0-9]+$/, 'Phone number must contain only digits')
        .min(6, 'Invalid phone number'),
});

export const passwordSchema = z.object({
    newPassword: z
        .string()
        .trim()
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must not exceed 20 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;