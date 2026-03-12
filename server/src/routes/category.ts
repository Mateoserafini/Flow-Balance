import Router from "express";
import { createCategory, getCategories, deleteCategory} from "../controllers/categoryController.js";  

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


const router = Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.delete("/:id", deleteCategory);

export default router;