import { Router } from 'express';
import { getProfile, updateProfile, updatePassword } from '../controllers/user.controller.js';
import { validateSchema } from '../middleware/validateSchema.js';
import { updateProfileSchema, updatePasswordSchema } from '../schemas/user.schema.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);
router.get('/profile', getProfile);
router.put('/profile', validateSchema(updateProfileSchema), updateProfile);
router.put('/password', validateSchema(updatePasswordSchema), updatePassword);

export default router;
