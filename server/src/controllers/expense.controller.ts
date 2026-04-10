import type { Request, Response } from "express";
import { Expense } from "../models/expense.model.js";

export const createExpense = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { amount, description, category, date } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const newExpense = new Expense({
            userId,
            amount,
            description,
            category,
            date
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        console.error("Error al crear gasto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getExpenses = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const expenses = await Expense.find({ userId }).populate('category').sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error al obtener gastos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getExpenseById = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const id = req.params.id as string;

        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const expense = await Expense.findOne({ _id: id, userId }).populate('category');
        
        if (!expense) {
            return res.status(404).json({ message: "Gasto no encontrado" });
        }

        res.status(200).json(expense);
    } catch (error) {
        console.error("Error al obtener gasto por ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const updateExpense = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const id = req.params.id as string;
        const { amount, description, category, date } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: id, userId },
            { amount, description, category, date },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Gasto no encontrado o no autorizado" });
        }

        res.status(200).json(updatedExpense);
    } catch (error) {
        console.error("Error al actualizar gasto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const deleteExpense = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const id = req.params.id as string;

        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId });

        if (!deletedExpense) {
            return res.status(404).json({ message: "Gasto no encontrado o no autorizado" });
        }

        res.status(200).json({ message: "Gasto eliminado correctamente", expense: deletedExpense });
    } catch (error) {
        console.error("Error al eliminar gasto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};