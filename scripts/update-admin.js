const crypto = require('crypto');
const { Pool } = require('pg');
require('dotenv').config();

const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env');
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString('hex');
const derived = crypto.scryptSync(adminPassword, salt, 64).toString('hex');
const passwordHash = `scrypt$${salt}$${derived}`;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function updateAdmin() {
  const check = await pool.query('SELECT id, email FROM "AdminUser" WHERE email = $1', [adminEmail]);
  if (check.rows.length === 0) {
    const insert = await pool.query(
      'INSERT INTO "AdminUser" ("id", "email", "passwordHash", "role", "isActive", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, true, NOW(), NOW()) RETURNING id, email',
      ['admin_' + Date.now(), adminEmail, passwordHash, 'SUPERADMIN']
    );
    console.log('Created admin:', insert.rows[0]);
  } else {
    const update = await pool.query(
      'UPDATE "AdminUser" SET "passwordHash" = $1, "isActive" = true, "updatedAt" = NOW() WHERE email = $2 RETURNING id, email',
      [passwordHash, adminEmail]
    );
    console.log('Updated admin password successfully:', update.rows[0]);
  }
  await pool.end();
}

updateAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
