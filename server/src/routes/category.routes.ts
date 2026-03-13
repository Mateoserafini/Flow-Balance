import Router from "express";
import { createCategory, getCategories, deleteCategory} from "../controllers/category.controller.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { createCategorySchema } from "../schemas/category.schema.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();


router.use(authenticateToken);
router.post("/", validateSchema(createCategorySchema), createCategory);
router.get("/", getCategories);
router.delete("/:id", deleteCategory);

export default router;