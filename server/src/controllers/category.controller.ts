import type { Request, Response } from "express";
import { Category } from "../models/category.model.js";

const defaultCategoriesExpenses = [
    "Alquiler",
    "Impuestos",
    "Comida",
    "Transporte",
    "Ocio",
    "Salud",
    "Educación",
    "Ropa",
    "Servicios",
    "Suscripciones",
    "Hogar",
    "Inversiones",
    "Ahorros",
    "Mascotas",
    "Viajes",
    "Regalos",
    "Donaciones",
    "Otros"
];  

const defaultCategoriesIncomes = [
    "Salario",
    "Ventas",
    "Inversiones",
    "Alquileres",
    "Freelance",
    "Intereses",
    "Dividendos",
    "Bonos",
    "Regalos",
    "Donaciones",
    "Otros"
];

export const createCategory = async (req: Request, res: Response) => {
};

export const getCategories = async (req: Request, res: Response) => {
};

export const deleteCategory = async (req: Request, res: Response) => {
};
