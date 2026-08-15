const { Client } = require('pg');
const client = new Client({ user: 'budget_user', password: 'budget_password', host: 'localhost', database: 'budget_db', port: 5432 });
client.connect().then(async () => {
  // Remove the 3 demo districts created from old seeding (they have no branches/users now)
  const res = await client.query(`DELETE FROM districts RETURNING name`);
  console.log(`Deleted ${res.rowCount} districts:`, res.rows.map(r => r.name).join(', '));
  client.end();
});
