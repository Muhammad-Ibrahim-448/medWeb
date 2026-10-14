import mysql from 'mysql2/promise';

const globalForDb = globalThis;

function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shoaib_jewellers',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    timezone: 'Z',
    decimalNumbers: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
}

export const pool = globalForDb.__mysqlPool || createPool();
if (!globalForDb.__mysqlPool) globalForDb.__mysqlPool = pool;

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function transaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export default pool;