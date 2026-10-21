import pool from './src/config/database';
async function main() {
  try {
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'app'
        AND table_name = 'inspections'
      ORDER BY ordinal_position
    `);
    console.log('\n========== INSPECTION COLUMNS ==========');
    console.table(columns.rows);
    const constraints = await pool.query(`
      SELECT
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_schema AS referenced_schema,
        ccu.table_name AS referenced_table,
        ccu.column_name AS referenced_column,
        cc.check_clause
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.key_column_usage kcu
        ON tc.constraint_catalog = kcu.constraint_catalog
        AND tc.constraint_schema = kcu.constraint_schema
        AND tc.constraint_name = kcu.constraint_name
        AND tc.table_name = kcu.table_name
      LEFT JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_catalog = ccu.constraint_catalog
        AND tc.constraint_schema = ccu.constraint_schema
        AND tc.constraint_name = ccu.constraint_name
      LEFT JOIN information_schema.check_constraints cc
        ON tc.constraint_catalog = cc.constraint_catalog
        AND tc.constraint_schema = cc.constraint_schema
        AND tc.constraint_name = cc.constraint_name
      WHERE tc.table_schema = 'app'
        AND tc.table_name = 'inspections'
      ORDER BY tc.constraint_type, tc.constraint_name
    `);
    console.log('\n========== INSPECTION CONSTRAINTS ==========');
    console.table(constraints.rows);
    const values = await pool.query(`
      SELECT
        'quality_grade' AS column_name,
        quality_grade AS value,
        COUNT(*) AS record_count
      FROM app.inspections
      GROUP BY quality_grade
      UNION ALL
      SELECT
        'status',
        status,
        COUNT(*)
      FROM app.inspections
      GROUP BY status
    `);
    console.log('\n========== EXISTING GRADE AND STATUS VALUES ==========');
    console.table(values.rows);
  } finally {
    await pool.end();
  }
}
main().catch(console.error);
