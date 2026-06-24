const { Client } = require('pg');

const client = new Client({
  user: 'budget_user',
  host: 'localhost',
  database: 'budget_db',
  password: 'budget_password',
  port: 5432,
});

client.connect();

client.query('DELETE FROM core_banking_transactions WHERE "isMapped" = false', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Deleted ${res.rowCount} rows`);
  }
  client.end();
});
