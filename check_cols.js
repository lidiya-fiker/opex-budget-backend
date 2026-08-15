const { Client } = require('pg');
const client = new Client({ user: 'budget_user', password: 'budget_password', host: 'localhost', database: 'budget_db', port: 5432 });
client.connect().then(async () => {
  const res = await client.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', ['notifications']);
  console.log('notifications columns:', res.rows.map(r => r.column_name).join(', '));
  const res2 = await client.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', ['budget_submissions']);
  console.log('budget_submissions columns:', res2.rows.map(r => r.column_name).join(', '));
  client.end();
});
