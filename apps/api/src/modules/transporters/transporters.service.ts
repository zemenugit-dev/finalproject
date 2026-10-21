import * as repository from './transporters.repository';

export async function getTransporters() {
  return repository.getAllTransporters();
}

export async function getTransporter(id: number) {
  return repository.getTransporterById(id);
}

export async function registerTransporter(data: {
  user_id: number;
  vehicle_type: string;
  license_plate: string;
}) {
  return repository.createTransporter(data);
}
