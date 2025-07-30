import { Router } from 'express';
import { getAllUsers, updateUser, changePassword } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.put('/:id/change-password', changePassword);

export default router;