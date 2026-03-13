import { Router } from 'express';
import { getProfile, updateProfile, updatePassword } from '../controllers/user.controller.js';
import { validateSchema } from '../middleware/validateSchema.js';
import { updateProfileSchema, updatePasswordSchema } from '../schemas/user.schema.js';

const router = Router();
router.get('/profile', getProfile);
router.put('/profile', validateSchema(updateProfileSchema), updateProfile);
router.put('/password', validateSchema(updatePasswordSchema), updatePassword);

export default router;
