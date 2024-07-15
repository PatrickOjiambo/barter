
import * as _schema from './schema'

import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const pool = new Pool({ connectionString: process.env.PG_CONNECTION_STRING! });

export const db = drizzle(pool, {
    schema: _schema
})

export default db;