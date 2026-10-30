import { z } from "zod";

export interface Todo {
    id: string;
    name: string;
    completed: boolean;
}

export const createTodoSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must contain at least 3 characters."),

    completed: z
        .boolean()
        .optional()
});

export const updateTodoSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must contain at least 3 characters."),

    completed: z
        .boolean()
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;