import Database from 'better-sqlite3';
import path from 'path';

// Determine database type from environment variable
const DATABASE_TYPE = process.env.DATABASE_TYPE || 'sqlite';

let db: any;
let initializeDatabase: () => void;

if (DATABASE_TYPE === 'memory') {
  // Use in-memory database (for serverless environments like Vercel)
  console.log('Using in-memory database');
  const memoryModule = require('./memory');
  db = memoryModule.default;
  initializeDatabase = memoryModule.initializeDatabase;
} else {
  // Use SQLite database (default for local development)
  console.log('Using SQLite database');
  const dbPath = path.join(process.cwd(), 'autocrm.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  initializeDatabase = () => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        card_last4 TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        amount REAL NOT NULL,
        items TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
  };
}

export { initializeDatabase };
export default db;
