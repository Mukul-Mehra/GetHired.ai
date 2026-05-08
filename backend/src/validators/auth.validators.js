import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "username must be at least 3 characters")
    .max(30, "username must be at most 30 characters"),
  email: z.string().trim().email("invalid email address"),
  password: z
    .string()
    .min(6, "password must be at least 6 characters")
    .max(128, "password must be at most 128 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("invalid email address"),
  password: z
    .string()
    .min(6, "password must be at least 6 characters")
    .max(128, "password must be at most 128 characters"),
});

export const chatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "message is required")
    .max(20000, "message must be at most 20000 characters"),
});
