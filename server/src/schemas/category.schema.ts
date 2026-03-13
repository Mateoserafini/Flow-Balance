import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string({
        message: "El nombre de la categoría es requerido y debe ser texto"  
    }).min(3, { message: "El nombre de la categoría debe tener al menos 3 caracteres" }),
    type: z.enum(['income', 'expense'], {
        message: "El tipo de categoría es requerido y debe ser 'income' o 'expense'"
    })
});

