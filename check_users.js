const { Client } = require('pg');

const client = new Client({
  user: 'budget_user',
  password: 'budget_password',
  host: 'localhost',
  database: 'budget_db',
  port: 5432
});

client.connect().then(async () => {
  const res = await client.query("SELECT email FROM users WHERE role IN ('BRANCH_MANAGER', 'BRANCH_USER') LIMIT 20");
  console.log(res.rows);
  client.end();
}).catch(err => {
  console.error(err);
  client.end();
});
