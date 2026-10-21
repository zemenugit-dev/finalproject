import { Request, Response } from 'express';
import { MarketsService } from './markets.service';

export class MarketsController {
    private marketsService: MarketsService;

    constructor() {
        this.marketsService = new MarketsService();
    }

    getMarkets = async (req: Request, res: Response) => {
        try {
            const markets = await this.marketsService.getAllMarkets();
            return res.status(200).json(markets);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };

    createMarket = async (req: Request, res: Response) => {
        try {
            const market = await this.marketsService.createMarket(req.body);
            return res.status(201).json(market);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    };
}
