import { Router } from 'express';
import { getProfile, updateProfile, updatePassword } from '../controllers/user.controller.js';

const router = Router();
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);

export default router;
