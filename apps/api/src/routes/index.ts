
import { Router } from 'express';
import productRoutes from '../modules/products/products.routes';
import marketRoutes from '../modules/markets/markets.routes';

const router = Router();

router.use('/products', productRoutes);
router.use('/markets', marketRoutes);

export default router;

