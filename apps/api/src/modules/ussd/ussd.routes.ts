
import { Router } from 'express';
import { UssdController } from './ussd.controller';

const router = Router();
const controller = new UssdController();

router.post('/', (req, res) => {
  void controller.handleRequest(req, res);
});

export default router;
