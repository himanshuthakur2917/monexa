import { emailValidation, nameValidation, passwordValidation } from "@/lib/validators/base.validator";
import z from "zod";


// Register schema
export const registerSchema = z.object({
    firstName: nameValidation,
    lastName: nameValidation,
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: passwordValidation
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Login schema
export const loginSchema = z.object({
    email: emailValidation,
    password: passwordValidation,
});

// Password reset schema
export const resetPasswordSchema = z.object({
    token: z.string(),
    password: passwordValidation,
    confirmPassword: passwordValidation
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Update profile schema
export const updateProfileSchema = z.object({
    firstName: nameValidation.optional(),
    lastName: nameValidation.optional(),
    email: emailValidation.optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;