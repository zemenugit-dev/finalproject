
import { Router } from 'express';
import { ForecastsController } from './forecasts.controller';

const router = Router();
const forecastsController = new ForecastsController();

router.get('/', forecastsController.getForecasts);

export default router;

