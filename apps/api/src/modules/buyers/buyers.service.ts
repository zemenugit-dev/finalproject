import { BuyersRepository } from './buyers.repository';
import { CreateBuyerInput } from './buyers.schema';

export class BuyersService {
    private buyersRepository = new BuyersRepository();

    async getAllBuyers() {
        return await this.buyersRepository.findAll();
    }

    async createBuyer(input: CreateBuyerInput) {
        return await this.buyersRepository.create(input);
    }
}
