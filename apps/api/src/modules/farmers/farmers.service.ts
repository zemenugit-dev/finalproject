
import {
  getAllFarmers,
  getFarmerById,
  getFarmerByUserId,
  createFarmer,
  type CreateFarmerProfileInput,
  type FarmerProfile
} from './farmers.repository';

export async function listFarmers(): Promise<FarmerProfile[]> {
  return getAllFarmers();
}

export async function findFarmerById(
  farmerId: number
): Promise<FarmerProfile | null> {
  if (!Number.isInteger(farmerId) || farmerId <= 0) {
    throw new Error('Invalid farmer ID');
  }

  return getFarmerById(farmerId);
}

export async function findFarmerByUserId(
  userId: number
): Promise<FarmerProfile | null> {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('Invalid user ID');
  }

  return getFarmerByUserId(userId);
}

export async function registerFarmerProfile(
  input: CreateFarmerProfileInput
): Promise<FarmerProfile> {
  if (!Number.isInteger(input.user_id) || input.user_id <= 0) {
    throw new Error('A valid user ID is required');
  }

  if (
    input.farm_size !== undefined &&
    input.farm_size !== null &&
    (!Number.isFinite(input.farm_size) || input.farm_size < 0)
  ) {
    throw new Error('Farm size must be a non-negative number');
  }

  const existingFarmer = await findFarmerByUserId(input.user_id);

  if (existingFarmer) {
    throw new Error('A farmer profile already exists for this user');
  }

  return createFarmer(input);
}

