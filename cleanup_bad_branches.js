const { Client } = require('pg');

const client = new Client({
  user: 'budget_user',
  password: 'budget_password',
  host: 'localhost',
  database: 'budget_db',
  port: 5432
});

client.connect().then(async () => {
  try {
    console.log('=== Nuclear cleanup: TRUNCATE CASCADE ===');

    // Use TRUNCATE CASCADE to wipe everything referencing branches
    await client.query(`TRUNCATE TABLE opex_budget_audits, opex_alerts, opex_transfer_requests, opex_utilization_requests, opex_budgets, budget_submissions, unit_submission_status, branch_mis_mapping CASCADE`);
    console.log('Truncated all dependent tables');

    await client.query(`DELETE FROM users WHERE role IN ('BRANCH_MANAGER', 'BRANCH_USER')`);
    console.log('Deleted branch-level users');

    await client.query(`TRUNCATE TABLE branches CASCADE`);
    console.log('Truncated branches');

    // Show remaining users
    const remaining = await client.query(`SELECT email, role FROM users ORDER BY role, email`);
    console.log('\nRemaining users:');
    remaining.rows.forEach(r => console.log(`  [${r.role}] ${r.email}`));
    console.log('\n=== Cleanup complete! Ready for fresh import. ===');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.end();
  }
});
