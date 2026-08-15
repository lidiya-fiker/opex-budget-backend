/**
 * seed-defaults.js
 * Run once: node seed-defaults.js
 *
 * Seeds the following default data:
 *  1. Associated expense rules  (pension 11%, trust fund 4%)
 *  2. Locked line items          (Deposit Interest, Depreciation & Amortisation)
 *  3. Approval matrix            (budget_transfer and supplementary_budget chains)
 */

const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER || 'budget_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'budget_db',
  password: process.env.DB_PASS || 'budget_password',
  port: process.env.DB_PORT || 5432,
});

async function seed() {
  await client.connect();
  console.log('✅ Connected to database');

  // ── 1. Associated Expense Rules ──────────────────────────────────────────────
  const expenseRules = [
    {
      mainAccountCode: 'BASIC_SALARY',
      linkedAccountCode: 'PENSION',
      percentage: 0.11,
      description: 'Pension contribution: 11% of Basic Salary',
    },
    {
      mainAccountCode: 'BASIC_SALARY',
      linkedAccountCode: 'TRUST_FUND',
      percentage: 0.04,
      description: 'Trust Fund: 4% of Basic Salary',
    },
  ];

  for (const rule of expenseRules) {
    await client.query(
      `INSERT INTO associated_expense_rules
         ("mainAccountCode", "linkedAccountCode", percentage, description, "createdAt")
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT DO NOTHING`,
      [rule.mainAccountCode, rule.linkedAccountCode, rule.percentage, rule.description],
    );
  }
  console.log('✅ Associated expense rules seeded (pension 11%, trust fund 4%)');

  // ── 2. Locked Line Items ──────────────────────────────────────────────────────
  const lockedItems = [
    {
      lineItemCode: 'DEPOSIT_INTEREST',
      lineItemName: 'Deposit Interest',
      reason: 'Requires deposit mobilization targets — locked centrally during budget call',
    },
    {
      lineItemCode: 'DEPRECIATION_AMORTIZATION',
      lineItemName: 'Depreciation & Amortization Expense',
      reason: 'Requires new and existing asset acquisition data — locked centrally during budget call',
    },
  ];

  for (const item of lockedItems) {
    await client.query(
      `INSERT INTO locked_line_items
         ("lineItemCode", "lineItemName", reason, "lockedAt")
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT DO NOTHING`,
      [item.lineItemCode, item.lineItemName, item.reason],
    );
  }
  console.log('✅ Locked line items seeded (Deposit Interest, Depreciation & Amortisation)');

  // ── 3. Approval Matrix ────────────────────────────────────────────────────────
  const matrix = [
    // Budget Transfer chain
    { requestType: 'budget_transfer', level: 1, role: 'BRANCH_MANAGER',    isMandatory: true },
    { requestType: 'budget_transfer', level: 2, role: 'DISTRICT_MANAGER',  isMandatory: true },
    { requestType: 'budget_transfer', level: 3, role: 'CHIEF_OFFICER',     isMandatory: true },
    { requestType: 'budget_transfer', level: 4, role: 'BCC_TEAM',          isMandatory: true },
    // Supplementary Budget chain
    { requestType: 'supplementary_budget', level: 1, role: 'BRANCH_MANAGER',   isMandatory: true },
    { requestType: 'supplementary_budget', level: 2, role: 'DISTRICT_MANAGER', isMandatory: true },
    { requestType: 'supplementary_budget', level: 3, role: 'CHIEF_OFFICER',    isMandatory: true },
    { requestType: 'supplementary_budget', level: 4, role: 'BCC_TEAM',         isMandatory: true },
    { requestType: 'supplementary_budget', level: 5, role: 'CEO',              isMandatory: true },
    // Manual Payment chain
    { requestType: 'manual_payment', level: 1, role: 'BUDGET_OWNER', isMandatory: true },
    { requestType: 'manual_payment', level: 2, role: 'BCC_TEAM',     isMandatory: true },
  ];

  for (const row of matrix) {
    await client.query(
      `INSERT INTO approval_matrix
         ("requestType", level, role, "isMandatory")
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [row.requestType, row.level, row.role, row.isMandatory],
    );
  }
  console.log('✅ Approval matrix seeded (budget_transfer, supplementary_budget, manual_payment)');

  await client.end();
  console.log('\n🎉 All defaults seeded successfully!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  client.end();
  process.exit(1);
});
