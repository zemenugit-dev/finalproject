
import pool from '../../config/database';
import {
  UssdSessionData,
  UssdSessionRow,
} from './ussd.schema';

export interface MarketRow {
  market_id: string;
  region_name: string;
  market_name: string;
}

export interface ProductRow {
  product_id: string;
  name: string;
  unit: string;
}

export interface PriceRow {
  product_id: string;
  name: string;
  unit: string;
  current_price: string | null;
  updated_at: Date | string | null;
}

export type TranslationLanguage = 'en' | 'am' | 'awn';

export class UssdRepository {
  async findLatestSession(
    phoneNumber: string
  ): Promise<UssdSessionRow | null> {
    const result = await pool.query(
      `SELECT
         session_id,
         phone_number,
         session_data,
         created_at
       FROM app.ussd_sessions_log
       WHERE phone_number = $1
       ORDER BY created_at DESC, session_id DESC
       LIMIT 1`,
      [phoneNumber]
    );

    return result.rows[0] ?? null;
  }

  async createSession(
    phoneNumber: string,
    data: UssdSessionData
  ): Promise<UssdSessionRow> {
    const result = await pool.query(
      `INSERT INTO app.ussd_sessions_log
         (phone_number, session_data)
       VALUES ($1, $2)
       RETURNING
         session_id,
         phone_number,
         session_data,
         created_at`,
      [phoneNumber, JSON.stringify(data)]
    );

    return result.rows[0];
  }

  async updateSession(
    sessionId: string,
    data: UssdSessionData
  ): Promise<void> {
    await pool.query(
      `UPDATE app.ussd_sessions_log
       SET session_data = $1,
           created_at = CURRENT_TIMESTAMP
       WHERE session_id = $2`,
      [JSON.stringify(data), sessionId]
    );
  }

  async getMarkets(): Promise<MarketRow[]> {
    const result = await pool.query(
      `SELECT
         market_id,
         region_name,
         market_name
       FROM app.regions_and_markets
       ORDER BY region_name, market_name`
    );

    return result.rows;
  }

  async getProductsForMarket(
    marketId: string
  ): Promise<ProductRow[]> {
    const result = await pool.query(
      `SELECT DISTINCT
         p.product_id,
         p.name,
         p.unit
       FROM app.products p
       LEFT JOIN app.market_prices mp
         ON mp.product_id = p.product_id
        AND mp.market_id = $1
       ORDER BY p.name`,
      [marketId]
    );

    return result.rows;
  }

  async getProductPrice(
    productId: string,
    marketId: string
  ): Promise<PriceRow | null> {
    const result = await pool.query(
      `SELECT
         p.product_id,
         p.name,
         p.unit,
         COALESCE(
           latest.current_price,
           p.price_per_unit
         ) AS current_price,
         latest.updated_at
       FROM app.products p
       LEFT JOIN LATERAL (
         SELECT
           mp.current_price,
           mp.updated_at
         FROM app.market_prices mp
         WHERE mp.product_id = p.product_id
           AND mp.market_id = $2
         ORDER BY
           mp.updated_at DESC,
           mp.price_id DESC
         LIMIT 1
       ) latest ON TRUE
       WHERE p.product_id = $1
       LIMIT 1`,
      [productId, marketId]
    );

    return result.rows[0] ?? null;
  }

  async getTranslation(
    key: string,
    language: TranslationLanguage
  ): Promise<string | null> {
    const result = await pool.query(
      `SELECT translated_text
       FROM app.ussd_translations
       WHERE translation_key = $1
         AND language_code = $2
       LIMIT 1`,
      [key, language]
    );

    return result.rows[0]?.translated_text ?? null;
  }
}
