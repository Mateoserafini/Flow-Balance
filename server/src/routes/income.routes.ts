import { Router } from "express";
import { createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome } from "../controllers/income.controller.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { createIncomeSchema, updateIncomeSchema } from "../schemas/income.schema.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateToken);
router.get('/', getIncomes);
router.post('/', validateSchema(createIncomeSchema), createIncome);
router.get('/:id', getIncomeById);
router.put('/:id', validateSchema(updateIncomeSchema), updateIncome);
router.delete('/:id', deleteIncome);

export default router;