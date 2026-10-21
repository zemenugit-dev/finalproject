import pool from '../../config/database';
import { CreateBuyerInput } from './buyers.schema';

export class BuyersRepository {
    async findAll() {
        const query = 'SELECT * FROM app.buyers_profile ORDER BY buyer_id DESC';
        const result = await pool.query(query);
        return result.rows;
    }

    async create(input: CreateBuyerInput) {
        const query = `
            INSERT INTO app.buyers_profile (user_id, company_name, business_address)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [input.user_id, input.company_name, input.business_address];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}
