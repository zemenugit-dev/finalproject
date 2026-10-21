import pool from '../../config/database';
export async function getAllTransporters() {
  const result = await pool.query(
    `SELECT transporter_id, user_id, vehicle_type, license_plate
     FROM app.transporters_profile
     ORDER BY transporter_id`
  );

  return result.rows;
}

export async function getTransporterById(id: number) {
  const result = await pool.query(
    `SELECT transporter_id, user_id, vehicle_type, license_plate
     FROM app.transporters_profile
     WHERE transporter_id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function createTransporter(data: {
  user_id: number;
  vehicle_type: string;
  license_plate: string;
}) {
  const result = await pool.query(
    `INSERT INTO app.transporters_profile
       (user_id, vehicle_type, license_plate)
     VALUES ($1, $2, $3)
     RETURNING transporter_id, user_id, vehicle_type, license_plate`,
    [data.user_id, data.vehicle_type, data.license_plate]
  );

  return result.rows[0];
}
