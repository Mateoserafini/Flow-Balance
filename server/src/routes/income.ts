import { Router } from "express";
import { createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome } from "../controllers/incomeController.js";


const router = Router();

router.get('/', getIncomes);
router.post('/', createIncome);
router.get('/:id', getIncomeById);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

export default router;