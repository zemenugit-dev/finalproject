
import pool from '../../config/database';

export interface FarmerProfile {
  farmer_id: string;
  user_id: string | null;
  farm_location: string | null;
  farm_size: string | null;
}

export interface CreateFarmerProfileInput {
  user_id: number;
  farm_location?: string | null;
  farm_size?: number | null;
}

export async function getAllFarmers(): Promise<FarmerProfile[]> {
  const result = await pool.query(
    `SELECT farmer_id, user_id, farm_location, farm_size
     FROM app.farmers_profile
     ORDER BY farmer_id`
  );

  return result.rows;
}

export async function getFarmerById(
  farmerId: number
): Promise<FarmerProfile | null> {
  const result = await pool.query(
    `SELECT farmer_id, user_id, farm_location, farm_size
     FROM app.farmers_profile
     WHERE farmer_id = $1`,
    [farmerId]
  );

  return result.rows[0] ?? null;
}

export async function getFarmerByUserId(
  userId: number
): Promise<FarmerProfile | null> {
  const result = await pool.query(
    `SELECT farmer_id, user_id, farm_location, farm_size
     FROM app.farmers_profile
     WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0] ?? null;
}

export async function createFarmer(
  input: CreateFarmerProfileInput
): Promise<FarmerProfile> {
  const result = await pool.query(
    `INSERT INTO app.farmers_profile
       (user_id, farm_location, farm_size)
     VALUES ($1, $2, $3)
     RETURNING farmer_id, user_id, farm_location, farm_size`,
    [
      input.user_id,
      input.farm_location ?? null,
      input.farm_size ?? null
    ]
  );

  return result.rows[0];
}

