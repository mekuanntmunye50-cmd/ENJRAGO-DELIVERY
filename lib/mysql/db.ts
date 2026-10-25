import mysql, { type Pool } from "mysql2/promise";

declare global {
  var enjeragoMysqlPool: Pool | undefined;
}

export function getDatabase(): Pool {
  if (globalThis.enjeragoMysqlPool) {
    return globalThis.enjeragoMysqlPool;
  }

  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  const useTls = process.env.DB_SSL === "true";
  const missing = [
    ["DB_HOST", DB_HOST],
    ["DB_PORT", DB_PORT],
    ["DB_NAME", DB_NAME],
    ["DB_USER", DB_USER],
    ["DB_PASSWORD", DB_PASSWORD],
  ]
    .filter(([, value]) => value === undefined)
    .map(([name]) => name);

  if (missing.length) {
    throw new Error(
      `Database is not configured. Set ${missing.join(", ")} in frontend/.env.local.`
    );
  }

  globalThis.enjeragoMysqlPool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    ...(useTls ? { ssl: { rejectUnauthorized: true } } : {}),
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    charset: "utf8mb4",
  });

  return globalThis.enjeragoMysqlPool;
}
