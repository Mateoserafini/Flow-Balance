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
    try {
        const userId = req.user?.id;
        const { name } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const newCategory = new Category({
            userId,
            name
        });

        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (error) {
        console.error("Error al crear categoría:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const categories = await Category.find({ userId }).sort({ name: 1 });
        res.status(200).json({ 
            userCategories: categories,
            defaultExpenses: defaultCategoriesExpenses,
            defaultIncomes: defaultCategoriesIncomes
        });
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const id = req.params.id as string;

        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const deletedCategory = await Category.findOneAndDelete({ _id: id, userId });

        if (!deletedCategory) {
            return res.status(404).json({ message: "Categoría no encontrada o no autorizada" });
        }

        res.status(200).json({ message: "Categoría eliminada correctamente", category: deletedCategory });
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
