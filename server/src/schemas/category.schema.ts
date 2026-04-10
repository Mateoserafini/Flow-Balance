import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string({
        message: "El nombre de la categoría es requerido y debe ser texto"
    }).min(3, { message: "El nombre de la categoría debe tener al menos 3 caracteres" }),
    type: z.enum(['income', 'expense'], {
        message: "El tipo de categoría es requerido y debe ser 'income' o 'expense'"
    }),
    icon: z.string().optional(),
    color: z.string().optional()
});

export const updateCategorySchema = z.object({
    name: z.string().min(3).optional(),
    type: z.enum(['income', 'expense']).optional(),
    icon: z.string().optional(),
    color: z.string().optional()
});
