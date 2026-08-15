# BMS — Complete API Endpoint Reference

| Controller | Method | Endpoint | Roles |
|---|---|---|---|
| **Auth** | POST | /auth/login/ldap | Public |
| **Admin** | GET | /admin/departments | All Authenticated |
| **Admin** | GET | /admin/districts | All Authenticated |
| **Admin** | POST | /admin/districts | ADMIN |
| **Admin** | PUT | /admin/districts/:id | ADMIN |
| **Admin** | DELETE | /admin/districts/:id | ADMIN |
| **Admin** | GET | /admin/branches | All Authenticated |
| **Admin** | POST | /admin/branches | ADMIN |
| **Admin** | PUT | /admin/branches/:id | ADMIN |
| **Admin** | DELETE | /admin/branches/:id | ADMIN |
| **Admin** | GET | /admin/users | ADMIN |
| **Admin** | POST | /admin/users | ADMIN |
| **Admin** | PUT | /admin/users/:id | ADMIN |
| **Admin** | DELETE | /admin/users/:id | ADMIN |
| **Budget Cycles** | GET | /budget-cycles | All Authenticated |
| **Budget Cycles** | GET | /budget-cycles/:id | All Authenticated |
| **Budget Cycles** | POST | /budget-cycles | BCC_TEAM, ADMIN |
| **Budget Cycles** | PATCH | /budget-cycles/:id | BCC_TEAM, ADMIN |
| **Budget Cycles** | POST | /budget-cycles/:id/publish | BCC_TEAM, ADMIN |
| **Submissions** | GET | /submissions | BRANCH_USER, BRANCH_MANAGER, DISTRICT_MANAGER |
| **Submissions** | GET | /submissions/district-branches | DISTRICT_MANAGER |
| **Submissions** | GET | /submissions/:id | All Authenticated |
| **Submissions** | POST | /submissions | BRANCH_USER, BRANCH_MANAGER |
| **Submissions** | PATCH | /submissions/:id/status | All Authenticated |
| **Submissions** | POST | /submissions/exclude | DISTRICT_MANAGER |
| **Submissions** | POST | /submissions/district-bulk-approve | DISTRICT_MANAGER |
| **Submissions** | POST | /submissions/bcc-district-bulk-action | BCC_TEAM |
| **Submissions** | PATCH | /submissions/:id/district-reapprove | DISTRICT_MANAGER |
| **Submissions** | POST | /submissions/exclude-district | BCC_TEAM |
| **Submissions** | POST | /submissions/bcc-bulk-submit-to-strategy | BCC_TEAM |
| **Expense Categories** | GET | /expense-categories | All Authenticated |
| **Expense Categories** | POST | /expense-categories | ADMIN |
| **Notifications** | GET | /notifications | All Authenticated |
| **Notifications** | PATCH | /notifications/:id/read | All Authenticated |
| **Districts** | POST | /districts/:id/strategy-approve | STRATEGY_OFFICE |
| **Districts** | POST | /districts/:id/executive-approve | EXECUTIVE |
| **Districts** | POST | /districts/:id/board-approve | BOARD |
| **Core Banking** | POST | /core-banking/refresh | BCC_TEAM, ADMIN |
| **Core Banking** | GET | /core-banking/logs | All Authenticated |
| **Core Banking** | GET | /core-banking/unmapped | All Authenticated |
| **Core Banking** | POST | /core-banking/map/:id | BCC_TEAM, ADMIN |
| **OPEX Budgets** | POST | /opex-budgets | BCC_TEAM, ADMIN |
| **OPEX Budgets** | GET | /opex-budgets | All Authenticated |
| **OPEX Budgets** | GET | /opex-budgets/alerts | BRANCH_MANAGER, BRANCH_USER, DISTRICT_MANAGER, DEPARTMENT_USER |
| **OPEX Budgets** | POST | /opex-budgets/alerts/:id/resolve | All Authenticated |
| **OPEX Budgets** | GET | /opex-budgets/fiscal-years | All Authenticated |
| **OPEX Budgets** | GET | /opex-budgets/:id | All Authenticated |
| **OPEX Budgets** | PATCH | /opex-budgets/:id | All Authenticated |
| **OPEX Reports** | GET | /opex-reports/bva | All Authenticated |
| **OPEX Reports** | GET | /opex-reports/branches | All Authenticated |
| **OPEX Transfers** | POST | /opex-transfers | All Authenticated |
| **OPEX Transfers** | GET | /opex-transfers | All Authenticated |
| **OPEX Utilizations** | POST | /opex-utilizations | All Authenticated |
| **OPEX Utilizations** | GET | /opex-utilizations | All Authenticated |
| **Manual Payments** | POST | /manual-payments | PAYMENT_TEAM, FIRD |
| **Manual Payments** | PATCH | /manual-payments/:id/approve | BCC_TEAM, ADMIN |
| **Manual Payments** | GET | /manual-payments/confirm?token= | REQUESTER (via email link) |
| **Approval Matrix** | GET | /approval-matrix | ADMIN |
| **Approval Matrix** | GET | /approval-matrix/chain?type= | ADMIN, BCC_TEAM |
| **Approval Matrix** | GET | /approval-matrix/by-type?type= | ADMIN, BCC_TEAM |
| **Approval Matrix** | POST | /approval-matrix | ADMIN |
| **Approval Matrix** | PATCH | /approval-matrix/:id | ADMIN |
| **Approval Matrix** | DELETE | /approval-matrix/:id | ADMIN |
| **Contract Register** | GET | /contract-register | BCC_TEAM, ADMIN |
| **Contract Register** | GET | /contract-register/active | BCC_TEAM, ADMIN |
| **Contract Register** | GET | /contract-register/:id | BCC_TEAM, ADMIN |
| **Contract Register** | POST | /contract-register | ADMIN |
| **Contract Register** | PATCH | /contract-register/:id | ADMIN |
| **Contract Register** | POST | /contract-register/expire | ADMIN |
| **Associated Expenses** | GET | /associated-expenses | All Authenticated |
| **Associated Expenses** | POST | /associated-expenses | ADMIN |
| **Associated Expenses** | GET | /associated-expenses/calculate?accountCode=&amount= | BCC_TEAM, ADMIN |
| **CAPEX** | GET | /capex/criteria | All Authenticated |
| **CAPEX** | GET | /capex/business-cases | BCC_TEAM, ADMIN |
| **CAPEX** | GET | /capex/business-cases/:id | BCC_TEAM, ADMIN |
| **CAPEX** | POST | /capex/business-cases | BCC_TEAM, ADMIN |
| **CAPEX** | PATCH | /capex/business-cases/:id/score | ADMIN |
| **Locked Line Items** | GET | /locked-line-items | All Authenticated |
| **Locked Line Items** | POST | /locked-line-items | BCC_TEAM, ADMIN |
| **Locked Line Items** | PATCH | /locked-line-items/:id/unlock | BCC_TEAM, ADMIN |
| **Locked Line Items** | GET | /locked-line-items/:code/check | All Authenticated |
| **Outliers** | GET | /outliers | All Authenticated |
| **Outliers** | GET | /outliers/by-category?category= | All Authenticated |
| **Outliers** | POST | /outliers | ADMIN |
| **Outliers** | POST | /outliers/evaluate | BCC_TEAM, ADMIN |
| **Unit Submission** | GET | /units/submission-status?cycleId= | BCC_TEAM |
| **Unit Submission** | POST | /units/submission-status/sync | ADMIN |
| **Unit Submission** | POST | /units/:id/mark-submitted | BCC_TEAM, ADMIN |
| **Branch / MIS** | GET | /branch-mis | All Authenticated |
| **Branch / MIS** | GET | /branch-mis/active | All Authenticated |
| **Branch / MIS** | GET | /branch-mis/closed | BCC_TEAM, ADMIN |
| **Branch / MIS** | POST | /branch-mis | ADMIN |
| **Branch / MIS** | PATCH | /branch-mis/:code/close | ADMIN |
| **Bulk Adjustments** | GET | /bulk-adjustments | BCC_TEAM, ADMIN |
| **Bulk Adjustments** | POST | /bulk-adjustments | BOD, ADMIN |
| **Bulk Upload** | POST | /bulk-uploads/conventional | BCC_TEAM, ADMIN |
| **Bulk Upload** | POST | /bulk-uploads/ifb | BCC_TEAM, ADMIN |
| **Bulk Upload** | POST | /bulk-uploads/supplementary | BCC_TEAM, ADMIN |
| **Reports** | GET | /reports/bva?level=BANK | All Authenticated |
| **Reports** | GET | /reports/bva?level=CHIEF | CHIEF, ADMIN |
| **Reports** | GET | /reports/bva?level=HO | HO_DEPT_USER, ADMIN |
| **Reports** | GET | /reports/bva?level=DISTRICT | DISTRICT_MANAGER, ADMIN |
| **Reports** | GET | /reports/bva?level=BRANCH | BRANCH_MANAGER, BRANCH_USER |
| **Reports** | GET | /reports/bva?level=BUDGET_OWNER | BUDGET_OWNER, ADMIN |
| **Reports** | GET | /reports/dashboard/manual-payments | BCC_TEAM, ADMIN |
| **Future (Phase 2)** | GET | /future/revenue/loan?fiscalYear= | ADMIN |
| **Future (Phase 2)** | GET | /future/revenue/investment?fiscalYear= | ADMIN |
| **Future (Phase 2)** | GET | /future/revenue/fx?fiscalYear= | ADMIN |
| **Future (Phase 2)** | GET | /future/revenue/fees?fiscalYear= | ADMIN |
| **Future (Phase 2)** | GET | /future/revenue/other?fiscalYear= | ADMIN |
| **Future (Phase 2)** | GET | /future/pro-forma/income-statement?fiscalYear= | ADMIN |
| **Future (Phase 2)** | GET | /future/pro-forma/balance-sheet?fiscalYear= | ADMIN |
| **Future (Phase 2)** | GET | /future/pro-forma/cash-flow?fiscalYear= | ADMIN |
| **Future (Phase 2)** | GET | /future/pro-forma/ratios?fiscalYear= | ADMIN |
