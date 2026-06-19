import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { execSync } from 'child_process';
import { District } from '../entities/district.entity';
import { Branch } from '../entities/branch.entity';
import { User, Role } from '../entities/user.entity';
import { ExpenseCategory } from '../entities/expense-category.entity';
import { Department } from '../entities/department.entity';
import { OpexBudget } from '../entities/opex-budget.entity';
import { CoreBankingTransaction } from '../entities/core-banking.entity';

const LLDAP_URL = 'http://localhost:17170';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'DashenAdmin@2026';

const GROUPS = [
  'BRANCH_USER',
  'BRANCH_MANAGER',
  'DISTRICT_MANAGER',
  'BCC_TEAM',
  'STRATEGY_OFFICER',
  'EXECUTIVE',
  'BOARD',
];

const USERS = [
  { username: 'bole.finance',     email: 'bole.finance@dashen.com',     displayName: 'Tigist Alemu',       role: 'BRANCH_USER' },
  { username: 'bole.manager',     email: 'bole.manager@dashen.com',     displayName: 'Berhane Tesfaye',   role: 'BRANCH_MANAGER' },
  { username: 'aad1.district',    email: 'aad1.district@dashen.com',    displayName: 'Meseret Girma',      role: 'DISTRICT_MANAGER' },
  { username: 'lideta.finance',   email: 'lideta.finance@dashen.com',   displayName: 'Hiwot Bekele',       role: 'BRANCH_USER' },
  { username: 'lideta.manager',   email: 'lideta.manager@dashen.com',   displayName: 'Samuel Tadesse',     role: 'BRANCH_MANAGER' },
  { username: 'aad2.district',    email: 'aad2.district@dashen.com',    displayName: 'Yonas Mulugeta',      role: 'DISTRICT_MANAGER' },
  { username: 'hawassa.finance',  email: 'hawassa.finance@dashen.com',  displayName: 'Selam Haile',        role: 'BRANCH_USER' },
  { username: 'hawassa.manager',  email: 'hawassa.manager@dashen.com',  displayName: 'Dawit Teshome',      role: 'BRANCH_MANAGER' },
  { username: 'hwd.district',     email: 'hwd.district@dashen.com',     displayName: 'Rahel Worku',        role: 'DISTRICT_MANAGER' },
  { username: 'adama.finance',    email: 'adama.finance@dashen.com',    displayName: 'Abebe Kebede',       role: 'BRANCH_USER' },
  { username: 'adama.manager',    email: 'adama.manager@dashen.com',    displayName: 'Meron Desta',        role: 'BRANCH_MANAGER' },
  { username: 'add.district',     email: 'add.district@dashen.com',     displayName: 'Getachew Lema',      role: 'DISTRICT_MANAGER' },
  { username: 'diredawa.finance', email: 'diredawa.finance@dashen.com', displayName: 'Fatuma Ali',         role: 'BRANCH_USER' },
  { username: 'diredawa.manager', email: 'diredawa.manager@dashen.com', displayName: 'Ibrahim Hassan',     role: 'BRANCH_MANAGER' },
  { username: 'ddd.district',     email: 'ddd.district@dashen.com',     displayName: 'Zewdu Tsegaye',      role: 'DISTRICT_MANAGER' },
  { username: 'bcc.team',         email: 'bcc.team@dashen.com',         displayName: 'Etsub Habtemariam',  role: 'BCC_TEAM' },
  { username: 'strategy',         email: 'strategy@dashen.com',         displayName: 'Biniyam Tilahun',    role: 'STRATEGY_OFFICER' },
  { username: 'ceo',              email: 'ceo@dashen.com',              displayName: 'Afework Gugsa',       role: 'EXECUTIVE' },
  { username: 'board.chair',      email: 'board.chair@dashen.com',      displayName: 'Board Chairperson',  role: 'BOARD' },
];

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(District) private districtRepo: Repository<District>,
    @InjectRepository(Branch) private branchRepo: Repository<Branch>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(ExpenseCategory) private categoryRepo: Repository<ExpenseCategory>,
    @InjectRepository(Department) private departmentRepo: Repository<Department>,
    @InjectRepository(OpexBudget) private opexBudgetRepo: Repository<OpexBudget>,
    @InjectRepository(CoreBankingTransaction) private txRepo: Repository<CoreBankingTransaction>,
  ) {}

  async onModuleInit() {
    // Check if DB already has users — if yes, skip all seeding to preserve data
    const userCount = await this.userRepo.count();
    if (userCount > 0) {
      this.logger.log(`✅ DB already seeded (${userCount} users found). Skipping seed.`);
      // Still ensure LDAP is seeded (idempotent check inside)
      await this.seedLdapIfNeeded();
      return;
    }

    // Handle legacy "Staff Costs" category from old seed
    const oldCategory = await this.categoryRepo.findOne({ where: { name: 'Staff Costs' } });
    if (oldCategory) {
      this.logger.log('Detected old seed data. Wiping and re-seeding with Dashen Excel categories...');
      try {
        await this.categoryRepo.query('TRUNCATE TABLE budget_items RESTART IDENTITY CASCADE');
        await this.categoryRepo.query('TRUNCATE TABLE budget_submissions RESTART IDENTITY CASCADE');
        await this.categoryRepo.query('TRUNCATE TABLE workflow_audits RESTART IDENTITY CASCADE');
        await this.categoryRepo.query('TRUNCATE TABLE expense_categories RESTART IDENTITY CASCADE');
      } catch (e) {
        this.logger.error('Truncation failed: ' + e.message);
      }
      await this.seedCategories();
      this.logger.log('✅ Re-seeded categories successfully!');
      return;
    }

    // Fresh DB — run full seed
    this.logger.log('Fresh database detected. Running full seed...');
    await this.seedCategories();
    await this.seedDistricts();
    await this.seedDepartments();
    this.logger.log('✅ Database seeded successfully!');

    // Also verify and seed LDAP on startup
    await this.seedLdapIfNeeded();
  }

  async seedIfNeeded() {
    // 1. Check if PostgreSQL users are empty
    const userCount = await this.userRepo.count();
    if (userCount === 0) {
      this.logger.log('PostgreSQL database is empty. Running Postgres seed...');
      await this.seedCategories();
      await this.seedDistricts();
      await this.seedDepartments();
      this.logger.log('✅ Postgres seeded!');
    }

    // 2. Check if LDAP needs seeding
    await this.seedLdapIfNeeded();
  }

  async seedLdapIfNeeded() {
    this.logger.log('Checking if LDAP needs seeding...');
    try {
      const loginRes = await fetch(`${LLDAP_URL}/auth/simple/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
      });
      if (!loginRes.ok) {
        this.logger.warn(`LDAP admin login failed (status ${loginRes.status}), skipping LDAP seed.`);
        return;
      }
      const { token } = await loginRes.json();
      const gqlHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const gql = async (query: string, variables: any = {}) => {
        const res = await fetch(`${LLDAP_URL}/api/graphql`, {
          method: 'POST',
          headers: gqlHeaders,
          body: JSON.stringify({ query, variables }),
        });
        const body = await res.json();
        if (body.errors) {
          this.logger.error('LDAP GQL Error: ' + JSON.stringify(body.errors));
        }
        return body.data;
      };

      // Query existing users
      const usersData = await gql(`
        query {
          users {
            id
          }
        }
      `);

      const existingUsers = usersData?.users || [];
      const hasBoleFinance = existingUsers.some((u: any) => u.id === 'bole.finance');

      if (hasBoleFinance) {
        this.logger.log('LDAP users already present. Skipping LDAP seed.');
        return;
      }

      this.logger.log('LDAP is empty. Seeding groups and users...');

      // Find container name dynamically
      let containerName = 'budget-lldap-1';
      try {
        const psOutput = execSync('docker ps --format "{{.Names}}"').toString();
        const found = psOutput.split('\n').map(n => n.trim()).find(n => n.includes('lldap'));
        if (found) {
          containerName = found;
          this.logger.log(`Found LDAP container: ${containerName}`);
        }
      } catch (err) {
        this.logger.warn(`Failed to find container name dynamically, using default: ${containerName}. Error: ${err.message}`);
      }

      // 1. Create groups
      for (const group of GROUPS) {
        try {
          await gql(`
            mutation CreateGroup($name: String!) {
              createGroup(name: $name) {
                id
              }
            }
          `, { name: group });
        } catch (e) {
          // ignore
        }
      }

      // 2. Create users and set passwords
      for (const user of USERS) {
        try {
          await gql(`
            mutation CreateUser($user: CreateUserInput!) {
              createUser(user: $user) {
                id
              }
            }
          `, {
            user: {
              id: user.username,
              email: user.email,
              displayName: user.displayName,
            }
          });
        } catch (e) {
          // ignore
        }

        try {
          execSync(`docker exec -i ${containerName} /app/lldap_set_password --username ${user.username} --password Dashen@2026 --admin-username ${ADMIN_USER} --admin-password ${ADMIN_PASS} --base-url ${LLDAP_URL}`);
        } catch (e) {
          this.logger.error(`Failed to set password for ${user.username}: ${e.message}`);
        }
      }

      // 3. Add users to groups
      const groupData = await gql(`
        query {
          groups {
            id
            displayName
          }
        }
      `);

      const groupMap: Record<string, number> = {};
      (groupData?.groups || []).forEach((g: any) => {
        groupMap[g.displayName] = g.id;
      });

      for (const user of USERS) {
        const groupId = groupMap[user.role];
        if (groupId) {
          try {
            await gql(`
              mutation AddUserToGroup($userId: String!, $groupId: Int!) {
                addUserToGroup(userId: $userId, groupId: $groupId) {
                  ok
                }
              }
            `, { userId: user.username, groupId });
          } catch (e) {
            // ignore
          }
        }
      }

      this.logger.log('✅ LDAP seeded successfully!');
    } catch (err) {
      this.logger.error(`Error during LDAP seeding: ${err.message}`);
    }
  }


  async seedCategories() {
    const CATEGORIES = [
      // 300 INTEREST EXPENSES
      { code: '30002', name: 'SAVINGS DEPOSITS', group: '300 INTEREST EXPENSES', isMandatory: false },
      { code: '30003', name: 'FIXED DEPOSITS', group: '300 INTEREST EXPENSES', isMandatory: false },
      { code: '30007', name: 'LOCAL BANK LOAN A/C', group: '300 INTEREST EXPENSES', isMandatory: false },
      { code: '30008', name: 'FOREIGN BANK LOANS', group: '300 INTEREST EXPENSES', isMandatory: false },
      { code: '30009', name: 'INTEREST PAID ON C/A', group: '300 INTEREST EXPENSES', isMandatory: false },
      { code: '30010', name: 'FOREIGN CURRENCY SAVING DEPOSITS', group: '300 INTEREST EXPENSES', isMandatory: false },
      { code: '30012', name: 'TELL BIRR MICRO SAVING INTEREST', group: '300 INTEREST EXPENSES', isMandatory: false },
      { code: '30013', name: 'INTEREST PAID ON INVESTMENT SAVING DEPOSITS', group: '300 INTEREST EXPENSES', isMandatory: false },

      // 310 FEES AND COMMISSION EXPENSE
      { code: '30116', name: 'Mudarabah deposit profit & loss expense', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: false },
      { code: '31001', name: 'CORRESPONDENT CHARGES', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: false },
      { code: '31002', name: 'LEGAL FEE', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: false },
      { code: '31003', name: 'MEMBERSHIP FEE', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: true },
      { code: '31005', name: 'MOTOR VEHICLE INSPECTION FEE', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: true },
      { code: '31006', name: 'NBE LICENSE FEE', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: true },
      { code: '31007', name: 'POSTAGE', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: false },
      { code: '31008', name: 'SUBSCRIPTION', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: false },
      { code: '31009', name: 'PROFESSIONAL SERVICE', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: true },
      { code: '31011', name: 'BANK CHARGE', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: false },
      { code: '31012', name: 'SWIFT CHARGE', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: false },
      { code: '31013', name: 'BROAD BAND SERVICE FEE', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: true },
      { code: '31014', name: 'VISA CHARGE', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: false },
      { code: '31015', name: 'MUNICIPALITY SANITATION FEES', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: false },
      { code: '31016', name: 'VISA POS REIMBURSEMENT CHARGE', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: false },
      { code: '31017', name: 'ANNUAL HARDWARE/SOFTWARE SERVICE FEE', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: true },
      { code: '31018', name: 'CARD CHARGES', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: false },
      { code: '31026', name: 'NBE FEES AND CHARGES ON RTGS AND CHEQUE TRANSACTIONS', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: false },
      { code: '31028', name: 'FOREIGN BORROWING PROCESSING FEES', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: false },
      { code: '31030', name: 'CONTRACT EMPLOYEE SALARIES', group: '310 FEES AND COMMISSION EXPENSE', isMandatory: true },

      // 340 PERSONNEL EXPENSE
      { code: '34001', name: 'CLERICAL STAFF SALARY', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34002', name: 'NON-CLERICAL STAFF SALARY', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34003', name: 'CASH INDEMNITY ALLOWANCE', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34004', name: 'DISTURBANCE ALLOWANCE', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34005', name: 'FUNERAL EXPENSE', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34006', name: 'HOUSING ALLOWANCE', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34007', name: 'HARDSHIP ALLOWANCE', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34008', name: 'MATERNITY PAY', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34009', name: 'MEDICAL', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34010', name: 'OVERTIME PAYMENTS', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34011', name: 'PROVIDENT / TRUST FUNDS', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34012', name: 'OPERATING LEASE RESIDENTIAL RENT', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34013', name: 'STAFF INSURANCE', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34014', name: 'TRAINING AND EDUCATION - (GITEX Global & GITEX Africa exposure visit)', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34015', name: 'UNIFORMS', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34017', name: 'SPECIAL DUTY BENEFIT', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34019', name: 'PENSION CONTRIBUTION', group: '340 PERSONNEL EXPENSE', isMandatory: true },
      { code: '34020', name: 'TRANSPORT ALLOWANCE', group: '340 PERSONNEL EXPENSE', isMandatory: true },
      { code: '34022', name: 'LEAVE PAYMENT', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34023', name: 'DEFINED BENEFIT PLAN - SEVERANCE PAYMENT', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34024', name: 'REPRESENTATION ALLOW', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34025', name: 'BONUS', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34027', name: 'MARRIAGE BENEFIT', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34028', name: 'ACTING ALLOWANCE', group: '340 PERSONNEL EXPENSE', isMandatory: false },
      { code: '34038', name: 'PAYMENT IN SMART', group: '340 PERSONNEL EXPENSE', isMandatory: false },

      // 350 Other Operating Expense
      { code: '35001', name: 'ADVERTISEMENT AND PROMOTION', group: '350 Other Operating Expense', isMandatory: true },
      { code: '35002', name: 'AUDIT FEES', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35004', name: 'CLEANING SUPPLIES', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35007', name: 'CORPORATE SOCIAL RESPONSIBILITY', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35008', name: 'ENTERTAINMENT', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35010', name: 'LAND AND BUILDING TAX', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35013', name: 'REPAIR AND MAINTENANCE', group: '350 Other Operating Expense', isMandatory: true },
      { code: '35014', name: 'LOSS ON FRGN. EXC.DEALINGS', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35020', name: 'MONEY BAGS', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35026', name: 'PERDIEM', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35027', name: 'PETROL AND OIL', group: '350 Other Operating Expense', isMandatory: true },
      { code: '35029', name: 'OPERATING LEASE OFFICE RENT', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35030', name: 'REVENUE STAMPS', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35031', name: 'STATIONERY AND PRINTING', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35033', name: 'SUNDRIES', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35034', name: 'UTILITY', group: '350 Other Operating Expense', isMandatory: true },
      { code: '35035', name: 'TRANSPORTATION', group: '350 Other Operating Expense', isMandatory: true },
      { code: '35037', name: 'TRANSPORT OF CURRENCY', group: '350 Other Operating Expense', isMandatory: true },
      { code: '35038', name: 'WAGES', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35039', name: 'WATER AND LIGHT', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35040', name: 'LOADING AND UNLOADING', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35042', name: 'INSURANCE', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35043', name: 'COMPUTER SUPPLIES', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35047', name: 'IMPAIRMENT CHARGE-LOANS AND ADVANCES', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35048', name: 'IMPAIRMENT CHARGE-RECEIVABLES', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35050', name: 'RECRUITMENT AND PROMOTION', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35053', name: 'DIRECTORS FEE', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35055', name: 'LOSS ON DISPOSAL OF ASSETS', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35059', name: 'NON CAPITALISED PROPERTY AND EQUIPMENT', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35067', name: 'OPERATING LEASE LAND EXPENSE', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35068', name: 'BOARD COMMITTEE & SECRETARY FEE', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35081', name: 'GIFT MADE IN DASHEN BANK SHARES (AT PAR)', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35083', name: 'ATM CLEANING SERVICE', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35084', name: 'REFERRAL MARKETING EXPENSE', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35095', name: 'AMOLE EXPENSES', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35096', name: 'PENALTY CHARGE', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35098', name: 'GIFT (For Innovative Idea Competition Winners)', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35099', name: 'COST OF GIFT CARD', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35192', name: 'OTHER PROVISIONS', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35193', name: 'OUT BOUND DASHEN AMEX INTERCHANGE FEE', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35194', name: 'FORMAT', group: '350 Other Operating Expense', isMandatory: false },
      { code: '35198', name: 'DEPOSIT INSURANCE', group: '350 Other Operating Expense', isMandatory: false }
    ];

    for (const cat of CATEGORIES) {
      const category = this.categoryRepo.create(cat);
      await this.categoryRepo.save(category);
    }
  }

  async seedDistricts() {
    const DISTRICTS = [
      {
        name: 'Addis Ababa District',
        code: 'AAD',
        branches: [
          { name: 'Bole Branch',          code: 'BR001' },
          { name: 'Lideta Branch',        code: 'BR002' },
        ],
        users: [
          { email: 'bole.finance@dashen.com',     role: Role.BRANCH_USER,      branchCode: 'BR001', displayName: 'Bole Finance Officer' },
          { email: 'bole.manager@dashen.com',     role: Role.BRANCH_MANAGER,   branchCode: 'BR001', displayName: 'Bole Branch Manager' },
          { email: 'lideta.finance@dashen.com',   role: Role.BRANCH_USER,      branchCode: 'BR002', displayName: 'Lideta Finance Officer' },
          { email: 'lideta.manager@dashen.com',   role: Role.BRANCH_MANAGER,   branchCode: 'BR002', displayName: 'Lideta Branch Manager' },
          { email: 'aad.district@dashen.com',     role: Role.DISTRICT_MANAGER, branchCode: null,    displayName: 'Addis Ababa District Manager' },
        ],
      },
      {
        name: 'Hawassa District',
        code: 'HWD',
        branches: [
          { name: 'Hawassa Main Branch',   code: 'BR003' },
          { name: 'Tabor Branch',          code: 'BR004' },
        ],
        users: [
          { email: 'hawassa.finance@dashen.com',  role: Role.BRANCH_USER,      branchCode: 'BR003', displayName: 'Hawassa Finance Officer' },
          { email: 'hawassa.manager@dashen.com',  role: Role.BRANCH_MANAGER,   branchCode: 'BR003', displayName: 'Hawassa Branch Manager' },
          { email: 'tabor.finance@dashen.com',    role: Role.BRANCH_USER,      branchCode: 'BR004', displayName: 'Tabor Finance Officer' },
          { email: 'tabor.manager@dashen.com',    role: Role.BRANCH_MANAGER,   branchCode: 'BR004', displayName: 'Tabor Branch Manager' },
          { email: 'hwd.district@dashen.com',     role: Role.DISTRICT_MANAGER, branchCode: null,    displayName: 'Hawassa District Manager' },
        ],
      }
    ];

    // Head Office users
    const HO_USERS = [
      { email: 'bcc.team@dashen.com',      role: Role.BCC_TEAM,         displayName: 'Etsub Habtemariam (BCC)' },
      { email: 'strategy@dashen.com',      role: Role.STRATEGY_OFFICER, displayName: 'Biniyam Tilahun (Strategy)' },
      { email: 'ceo@dashen.com',           role: Role.EXECUTIVE,        displayName: 'Afework Gugsa (CEO)' },
      { email: 'board.chair@dashen.com',   role: Role.BOARD,            displayName: 'Board Chairperson' },
    ];

    const passwordHash = await bcrypt.hash('Dashen@2026', 10);

    for (const districtData of DISTRICTS) {
      // Create district
      const district = this.districtRepo.create({ name: districtData.name, code: districtData.code });
      const savedDistrict = await this.districtRepo.save(district);

      // Create branches
      const branchMap: Record<string, Branch> = {};
      for (const branchData of districtData.branches) {
        const branch = this.branchRepo.create({ name: branchData.name, code: branchData.code, district: savedDistrict });
        const savedBranch = await this.branchRepo.save(branch);
        branchMap[branchData.code] = savedBranch;
      }

      // Create district users
      for (const userData of districtData.users) {
        const user = this.userRepo.create({
          email: userData.email,
          displayName: userData.displayName,
          passwordHash,
          role: userData.role,
          district: savedDistrict,
          branch: userData.branchCode ? branchMap[userData.branchCode] : null,
        });
        await this.userRepo.save(user);
        this.logger.log(`  Created user: ${userData.email} [${userData.role}]`);
      }
    }

    // Create Head Office users
    for (const userData of HO_USERS) {
      const user = this.userRepo.create({
        email: userData.email,
        displayName: userData.displayName,
        passwordHash,
        role: userData.role,
      });
      await this.userRepo.save(user);
      this.logger.log(`  Created HO user: ${userData.email} [${userData.role}]`);
    }
  }

  async seedDepartments() {
    const DEPARTMENTS = [
      { code: 'DEP001', name: 'IT Department' },
      { code: 'DEP002', name: 'Human Resources' },
      { code: 'DEP003', name: 'Operations' },
      { code: 'DEP004', name: 'BCC Team' },
      { code: 'DEP005', name: 'Strategy Office' },
    ];

    for (const d of DEPARTMENTS) {
      const dep = this.departmentRepo.create(d);
      await this.departmentRepo.save(dep);
    }
    this.logger.log('  Seeded 5 departments.');
  }
}
