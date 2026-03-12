import type { Request, Response } from "express";
import { User } from "../models/user.js";

export const login = (req: Request, res: Response) => {
    res.send("Login successful");
};

export const register = (req: Request, res: Response) => {
    res.send("Registration successful");
};