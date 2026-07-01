| Controller Route | Method | Endpoint Path | Roles Restrictions |
| --- | --- | --- | --- |
| /admin | GET | /admin/departments | All Authenticated Users |
| /admin | GET | /admin/districts | All Authenticated Users |
| /admin | POST | /admin/districts | All Authenticated Users |
| /admin | PUT | /admin/districts/:id | All Authenticated Users |
| /admin | DELETE | /admin/districts/:id | All Authenticated Users |
| /admin | GET | /admin/branches | All Authenticated Users |
| /admin | POST | /admin/branches | All Authenticated Users |
| /admin | PUT | /admin/branches/:id | All Authenticated Users |
| /admin | DELETE | /admin/branches/:id | All Authenticated Users |
| /admin | GET | /admin/users | All Authenticated Users |
| /admin | POST | /admin/users | All Authenticated Users |
| /admin | PUT | /admin/users/:id | All Authenticated Users |
| /admin | DELETE | /admin/users/:id | All Authenticated Users |
| /auth | POST | /auth/login/ldap | All Authenticated Users |
| /budget-cycles | GET | /budget-cycles | All Authenticated Users |
| /budget-cycles | GET | /budget-cycles/:id | All Authenticated Users |
| /budget-cycles | POST | /budget-cycles | All Authenticated Users |
| /budget-cycles | PATCH | /budget-cycles/:id | All Authenticated Users |
| /budget-cycles | POST | /budget-cycles/:id/publish | All Authenticated Users |
| /submissions | GET | /submissions | BRANCH_USER, BRANCH_MANAGER, DISTRICT_MANAGER |
| /submissions | GET | /submissions/district-branches | DISTRICT_MANAGER |
| /submissions | GET | /submissions/:id | All Authenticated Users |
| /submissions | POST | /submissions | All Authenticated Users |
| /submissions | PATCH | /submissions/:id/status | All Authenticated Users |
| /submissions | POST | /submissions/exclude | DISTRICT_MANAGER |
| /submissions | POST | /submissions/district-bulk-approve | DISTRICT_MANAGER |
| /submissions | POST | /submissions/bcc-district-bulk-action | BCC_TEAM |
| /submissions | PATCH | /submissions/:id/district-reapprove | DISTRICT_MANAGER |
| /submissions | POST | /submissions/exclude-district | BCC_TEAM |
| /submissions | POST | /submissions/bcc-bulk-submit-to-strategy | BCC_TEAM |
| /expense-categories | GET | /expense-categories | All Authenticated Users |
| /expense-categories | POST | /expense-categories | All Authenticated Users |
| /notifications | GET | /notifications | All Authenticated Users |
| /notifications | PATCH | /notifications/:id/read | All Authenticated Users |
| /districts | POST | /districts/:id/strategy-approve | All Authenticated Users |
| /districts | POST | /districts/:id/executive-approve | All Authenticated Users |
| /districts | POST | /districts/:id/board-approve | All Authenticated Users |
| /core-banking | POST | /core-banking/refresh | BCC_TEAM, ADMIN |
| /core-banking | GET | /core-banking/logs | All Authenticated Users |
| /core-banking | GET | /core-banking/unmapped | All Authenticated Users |
| /core-banking | POST | /core-banking/map/:id | BCC_TEAM, ADMIN |
| /opex-budgets | POST | /opex-budgets | BCC_TEAM, ADMIN |
| /opex-budgets | GET | /opex-budgets | All Authenticated Users |
| /opex-budgets | GET | /opex-budgets/alerts | BRANCH_MANAGER, BRANCH_USER, DISTRICT_MANAGER, DEPARTMENT_USER |
| /opex-budgets | POST | /opex-budgets/alerts/:id/resolve | All Authenticated Users |
| /opex-budgets | GET | /opex-budgets/fiscal-years | All Authenticated Users |
| /opex-budgets | GET | /opex-budgets/:id | All Authenticated Users |
| /opex-budgets | PATCH | /opex-budgets/:id | All Authenticated Users |
| /opex-reports | GET | /opex-reports/bva | All Authenticated Users |
| /opex-reports | GET | /opex-reports/branches | All Authenticated Users |
| /opex-transfers | POST | /opex-transfers | All Authenticated Users |
| /opex-transfers | GET | /opex-transfers | All Authenticated Users |
| /opex-utilizations | POST | /opex-utilizations | All Authenticated Users |
| /opex-utilizations | GET | /opex-utilizations | All Authenticated Users |
