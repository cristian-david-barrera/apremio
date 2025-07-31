import { Router } from 'express';
import { getAllUsers, updateUser, changePassword, createUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/', getAllUsers);
router.post('/', createUser); 
router.put('/:id', updateUser);
router.put('/:id/change-password', changePassword);

export default router;