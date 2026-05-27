import { Pool } from 'pg';

let pool: Pool | null = null;

const getPool = (): Pool => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    pool.on('error', (err: Error) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  return pool;
};

/**
 * Initialize the database schema on startup
 * Creates the users table if it doesn't exist
 */
export const initializeDatabase = async () => {
  const client = await getPool().connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database schema initialized');
  } catch (err) {
    console.error('Failed to initialize database schema:', err);
  } finally {
    client.release();
  }
};

export { getPool };
