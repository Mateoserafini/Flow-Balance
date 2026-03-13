import type { Request, Response } from "express";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { username, email } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({
            message: "Perfil actualizado correctamente",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { currentPassword, newPassword } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const user = await User.findById(userId);
        if (!user || !user.password) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "La contraseña actual es incorrecta" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar contraseña:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};