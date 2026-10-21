import { MarketsRepository } from './markets.repository';
import { CreateMarketInput } from './markets.schema';

export class MarketsService {
    private marketsRepository: MarketsRepository;

    constructor() {
        this.marketsRepository = new MarketsRepository();
    }

    async getAllMarkets() {
        return await this.marketsRepository.findAll();
    }

    async createMarket(input: CreateMarketInput) {
        return await this.marketsRepository.create(input);
    }
}
