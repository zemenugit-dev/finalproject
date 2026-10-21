import { ProductRepository } from './products.repository';

export class ProductService {
    private productRepository = new ProductRepository();

    async getAllProducts() {
        return await this.productRepository.findAll();
    }

    async createProduct(productData: any) {
        return await this.productRepository.create(productData);
    }
}
