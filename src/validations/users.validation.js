import { z } from 'zod';

export const userIdSchema = z.object({
    id: z.coerce.number().int().positive({
        message: 'User ID must be a positive integer',
    }),
});

export const updateUserSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long' })
        .max(255, { message: 'Name must not exceed 255 characters' })
        .trim()
        .optional(),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email({ message: 'Invalid email format' })
        .max(255, { message: 'Email must not exceed 255 characters' })
        .optional(),
    role: z
        .enum(['user', 'admin'], {
            errorMap: () => ({ message: 'Role must be either "user" or "admin"' }),
        })
        .optional(),
}).refine(
    (data) => {
        // At least one field must be provided for update
        return Object.keys(data).length > 0;
    },
    {
        message: 'At least one field must be provided for update',
    }
);
