import { Request, Response } from 'express';
import { BuyersService } from './buyers.service';

export class BuyersController {
    private buyersService = new BuyersService();

    getBuyers = async (req: Request, res: Response): Promise<void> => {
        try {
            const buyers = await this.buyersService.getAllBuyers();
            res.status(200).json(buyers);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    createBuyer = async (req: Request, res: Response): Promise<void> => {
        try {
            const newBuyer = await this.buyersService.createBuyer(req.body);
            res.status(201).json(newBuyer);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
}
