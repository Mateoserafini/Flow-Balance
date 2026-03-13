import type { Request, Response } from "express";
import { Income } from "../models/income.model.js";

export const getIncomes = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const incomes = await Income.find({ userId }).sort({ date: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        console.error("Error al obtener ingresos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const createIncome = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { amount, description, category, date } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const newIncome = new Income({
            userId,
            amount,
            description,
            category,
            date
        });

        await newIncome.save();
        res.status(201).json(newIncome);
    } catch (error) {
        console.error("Error al crear ingreso:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getIncomeById = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const id = req.params.id as string;

        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const income = await Income.findOne({ _id: id, userId });
        
        if (!income) {
            return res.status(404).json({ message: "Ingreso no encontrado" });
        }

        res.status(200).json(income);
    } catch (error) {
        console.error("Error al obtener ingreso por ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const updateIncome = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const id = req.params.id as string;
        const { amount, description, category, date } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const updatedIncome = await Income.findOneAndUpdate(
            { _id: id, userId },
            { amount, description, category, date },
            { new: true }
        );

        if (!updatedIncome) {
            return res.status(404).json({ message: "Ingreso no encontrado o no autorizado" });
        }

        res.status(200).json(updatedIncome);
    } catch (error) {
        console.error("Error al actualizar ingreso:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const deleteIncome = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const id = req.params.id as string;

        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const deletedIncome = await Income.findOneAndDelete({ _id: id, userId });

        if (!deletedIncome) {
            return res.status(404).json({ message: "Ingreso no encontrado o no autorizado" });
        }

        res.status(200).json({ message: "Ingreso eliminado correctamente", income: deletedIncome });
    } catch (error) {
        console.error("Error al eliminar ingreso:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};