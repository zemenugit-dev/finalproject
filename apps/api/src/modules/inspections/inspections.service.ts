import * as repository from './inspections.repository';
import type {
  InspectionFilters,
  CreateInspectionInput,
  UpdateInspectionInput,
} from './inspections.types';

export class InspectionNotFoundError extends Error {
  constructor(id: number) {
    super(`Inspection with ID ${id} was not found.`);
    this.name = 'InspectionNotFoundError';
  }
}

export async function getInspections(
  filters: InspectionFilters,
) {
  return repository.findAllInspections(filters);
}

export async function getInspectionById(id: number) {
  const inspection = await repository.findInspectionById(id);

  if (!inspection) {
    throw new InspectionNotFoundError(id);
  }

  return inspection;
}

export async function addInspection(
  input: CreateInspectionInput,
) {
  return repository.createInspection(input);
}

export async function editInspection(
  id: number,
  input: UpdateInspectionInput,
) {
  const inspection = await repository.updateInspection(id, input);

  if (!inspection) {
    throw new InspectionNotFoundError(id);
  }

  return inspection;
}

export async function removeInspection(id: number) {
  const deleted = await repository.deleteInspection(id);

  if (!deleted) {
    throw new InspectionNotFoundError(id);
  }

  return { inspection_id: String(id) };
}
