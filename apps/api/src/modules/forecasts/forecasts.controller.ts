
import { Request, Response } from 'express';
import { ForecastsService } from './forecasts.service';
import { forecastQuerySchema } from './forecasts.schema';

export class ForecastsController {
    private forecastsService: ForecastsService;

    constructor() {
        this.forecastsService = new ForecastsService();
    }

    getForecasts = async (req: Request, res: Response): Promise<void> => {
        const validation = forecastQuerySchema.safeParse(req.query);

        if (!validation.success) {
            res.status(400).json({
                success: false,
                message: 'Invalid forecast parameters.',
                errors: validation.error.flatten(),
            });
            return;
        }

        try {
            const forecasts = await this.forecastsService.getForecasts(
                validation.data
            );

            res.status(200).json({
                success: true,
                count: forecasts.length,
                data: forecasts,
            });
        } catch (error) {
            console.error('Forecast error:', error);

            res.status(500).json({
                success: false,
                message: 'Unable to retrieve forecasts.',
            });
        }
    };
}

