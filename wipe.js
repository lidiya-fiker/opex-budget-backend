const { Client } = require('pg');

const client = new Client({
  user: 'budget_user',
  password: 'budget_password',
  host: 'localhost',
  database: 'budget_db',
  port: 5432
});

client.connect().then(async () => {
  await client.query('UPDATE users SET "branchId" = NULL, "districtId" = NULL');
  await client.query('TRUNCATE TABLE workflow_audits CASCADE');
  await client.query("DELETE FROM users WHERE role IN ('BRANCH_USER', 'BRANCH_MANAGER', 'DISTRICT_MANAGER')");
  await client.query('TRUNCATE TABLE branches CASCADE');
  await client.query('TRUNCATE TABLE districts CASCADE');
  await client.query('TRUNCATE TABLE expense_categories CASCADE');
  await client.query('TRUNCATE TABLE departments CASCADE');
  console.log('Successfully wiped all tables for clean seed!');
  client.end();
}).catch(err => {
  console.error(err);
  client.end();
});
