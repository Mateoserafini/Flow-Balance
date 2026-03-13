import { z } from 'zod';

export const createIncomeSchema = z.object({
    amount: z.number({
        message: "El monto es requerido y debe ser un número"   
    }).positive({ message: "El monto debe ser un número positivo" }),
    category: z.string({
        message: "La categoría es requerida y debe ser texto"
    }).min(3, { message: "La categoría debe tener al menos 3 caracteres" }),
    description: z.string({
        message: "La descripción es requerida y debe ser texto"
    }).min(3, { message: "La descripción debe tener al menos 3 caracteres" }),  
    date: z.string({
        message: "La fecha es requerida y debe ser una fecha válida"
    }).refine((date) => !isNaN(Date.parse(date)), {
        message: "La fecha no es válida"
    })
});

export const updateIncomeSchema = z.object({
    amount: z.number({
        message: "El monto debe ser un número"  
    }).positive({ message: "El monto debe ser un número positivo" }).optional(),
    category: z.string({
        message: "La categoría debe ser texto"
    }).min(3, { message: "La categoría debe tener al menos 3 caracteres" }).optional(),
    description: z.string({
        message: "La descripción debe ser texto"
    }).min(3, { message: "La descripción debe tener al menos 3 caracteres" }).optional(),
    date: z.string({
        message: "La fecha debe ser una fecha válida"
    }).refine((date) => !isNaN(Date.parse(date)), {
        message: "La fecha no es válida"
    }).optional()
});