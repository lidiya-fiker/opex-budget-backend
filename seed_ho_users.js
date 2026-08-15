const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
  user: 'budget_user',
  password: 'budget_password',
  host: 'localhost',
  database: 'budget_db',
  port: 5432
});

const HO_USERS = [
  { email: 'admin@dashen.com',             role: 'ADMIN',              displayName: 'System Administrator' },
  { email: 'bcc.team@dashen.com',          role: 'BCC_TEAM',           displayName: 'Etsub Habtemariam (BCC)' },
  { email: 'strategy@dashen.com',          role: 'STRATEGY_OFFICER',   displayName: 'Biniyam Tilahun (Strategy)' },
  { email: 'ceo@dashen.com',               role: 'EXECUTIVE',          displayName: 'Afework Gugsa (CEO)' },
  { email: 'board.chair@dashen.com',       role: 'BOARD',              displayName: 'Board Chairperson' },
  { email: 'chief.finance@dashen.com',     role: 'CHIEF_OFFICER',      displayName: 'Solomon Tefera (CFO)' },
  { email: 'chief.operations@dashen.com',  role: 'CHIEF_OFFICER',      displayName: 'Mekdes Alemu (COO)' },
  { email: 'payment.team@dashen.com',      role: 'PAYMENT_SETTLEMENT', displayName: 'Payment & Settlement Team' },
  { email: 'fird.team@dashen.com',         role: 'FIRD',               displayName: 'FIRD Team Officer' },
  { email: 'budget.owner@dashen.com',      role: 'BUDGET_OWNER',       displayName: 'IT Department Budget Owner' },
  { email: 'audit@dashen.com',             role: 'INTERNAL_AUDIT',     displayName: 'Internal Auditor' },
];

client.connect().then(async () => {
  try {
    const passwordHash = await bcrypt.hash('Password@123', 10);
    
    for (const user of HO_USERS) {
      const existing = await client.query('SELECT id FROM users WHERE email = $1', [user.email]);
      if (existing.rowCount === 0) {
        await client.query(
          'INSERT INTO users (email, "displayName", "passwordHash", role) VALUES ($1, $2, $3, $4)',
          [user.email, user.displayName, passwordHash, user.role]
        );
        console.log(`Created: ${user.email} [${user.role}]`);
      } else {
        console.log(`Already exists: ${user.email}`);
      }
    }
    
    const remaining = await client.query(`SELECT email, role FROM users ORDER BY role, email`);
    console.log('\nAll users in DB:');
    remaining.rows.forEach(r => console.log(`  [${r.role}] ${r.email}`));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.end();
  }
});
