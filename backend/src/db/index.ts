import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import * as dotenv from 'dotenv';

dotenv.config();

// Build connection string - supports optional IP bypass for networks with DNS/timeout issues
let connectionString = process.env.DATABASE_URL!;

// If NEON_IP_BYPASS is set, replace hostname with IP and add endpoint ID
const neonHost = process.env.NEON_HOST;
const neonIp = process.env.NEON_IP;
const neonEndpoint = process.env.NEON_ENDPOINT;

if (neonHost && neonIp && neonEndpoint) {
    connectionString = connectionString.replace(neonHost, neonIp);
    connectionString += (connectionString.includes('?') ? '&' : '?') + `options=endpoint%3D${neonEndpoint}`;
}

const sql = postgres(connectionString, {
    max: 1,
    ssl: neonIp ? { rejectUnauthorized: false } : 'require',
});

export const db = drizzle(sql, { schema });


