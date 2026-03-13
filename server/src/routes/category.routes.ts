import Router from "express";
import { createCategory, getCategories, deleteCategory} from "../controllers/category.controller.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { createCategorySchema } from "../schemas/category.schema.js";

const router = Router();

router.post("/", validateSchema(createCategorySchema), createCategory);
router.get("/", getCategories);
router.delete("/:id", deleteCategory);

export default router;