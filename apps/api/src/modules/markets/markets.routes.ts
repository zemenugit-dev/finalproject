import { Router } from 'express';
import { MarketsController } from './markets.controller';

const router = Router();
const marketsController = new MarketsController();

router.get('/', marketsController.getMarkets);
router.post('/', marketsController.createMarket);

export default router;
