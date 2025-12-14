import pg from 'pg';
import config from './index.js';

const { Pool } = pg;

// Create a connection pool
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  user: config.database.user,
  password: config.database.password,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test the database connection
pool.on('connect', () => {
  if (config.nodeEnv !== 'test') {
    console.log('✅ Database connected successfully');
  }
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  // eslint-disable-next-line no-process-exit
  process.exit(-1);
});

/**
 * Execute a query with parameterized values
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (config.nodeEnv === 'development') {
      console.log('📊 Executed query', { text, duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise<Object>} Database client
 */
export const getClient = async () => {
  const client = await pool.connect();
  
  const originalQuery = client.query;
  const originalRelease = client.release;
  
  // Add query execution timestamp
  client.query = (...args) => {
    client.lastQuery = args;
    return originalQuery.apply(client, args);
  };
  
  // Track if client has been released
  let released = false;
  client.release = () => {
    if (released) {
      console.error('❌ Warning: Client already released');
      return;
    }
    released = true;
    return originalRelease.apply(client);
  };
  
  return client;
};

/**
 * Close all database connections
 */
export const closePool = async () => {
  await pool.end();
  console.log('✅ Database pool closed');
};

export default {
  query,
  getClient,
  closePool,
  pool,
};
