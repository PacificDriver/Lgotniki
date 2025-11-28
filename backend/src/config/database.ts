import { Pool, types } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configure pg to return DATE as string (YYYY-MM-DD) instead of Date object
// This prevents timezone issues when dates are serialized to JSON
types.setTypeParser(1082, (value: string) => value); // DATE type (OID 1082)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;


