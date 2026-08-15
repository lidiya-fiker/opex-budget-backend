const { Client } = require('pg');
const client = new Client({ user: 'budget_user', password: 'budget_password', host: 'localhost', database: 'budget_db', port: 5432 });
client.connect().then(async () => {
  const res = await client.query(`SELECT id, email, role FROM users ORDER BY role, email`);
  console.log(`Total users: ${res.rowCount}`);
  res.rows.forEach(r => console.log(`  [${r.role}] ${r.email}`));
  
  const branches = await client.query(`SELECT id, name FROM branches ORDER BY name`);
  console.log(`\nTotal branches: ${branches.rowCount}`);
  
  const districts = await client.query(`SELECT id, name FROM districts ORDER BY name`);
  console.log(`\nTotal districts: ${districts.rowCount}`);
  districts.rows.forEach(r => console.log(`  ${r.name}`));
  
  client.end();
});
