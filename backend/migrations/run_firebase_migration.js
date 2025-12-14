import { query } from '../src/config/database.js';

async function runMigration() {
  try {
    console.log('Running migration: Add firebase_uid column...');
    
    // Add firebase_uid column
    await query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(128) UNIQUE
    `);
    
    // Add index
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid)
    `);
    
    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
