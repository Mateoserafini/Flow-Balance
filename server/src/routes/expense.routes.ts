import { Router } from "express";
import { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense } from "../controllers/expense.controller.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { createExpenseSchema, updateExpenseSchema } from "../schemas/expense.schema.js";


const router = Router();

router.post('/', validateSchema(createExpenseSchema), createExpense);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.put('/:id', validateSchema(updateExpenseSchema), updateExpense);
router.delete('/:id', deleteExpense);

export default router;