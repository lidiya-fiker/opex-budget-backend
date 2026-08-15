const { Client } = require('pg');
const client = new Client({ user: 'budget_user', password: 'budget_password', host: 'localhost', database: 'budget_db', port: 5432 });
client.connect().then(async () => {
  const res = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`);
  console.log(res.rows.map(r => r.table_name).join('\n'));
  client.end();
});
