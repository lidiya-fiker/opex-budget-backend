import { Injectable, BadRequestException, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlAccount, BankingType } from '../entities/gl-account.entity';
import * as XLSX from 'xlsx';

export const CONVENTIONAL_GL_DATA = [
  // 300 Interest Expenses
  { glCode: '600030002', glDescription: 'SAVINGS DEPOSITS', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '600030003', glDescription: 'FIXED DEPOSITS', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '600030007', glDescription: 'LOCAL BANK LOAN A/C', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '600030008', glDescription: 'FOREIGN BANK LOANS', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '600030009', glDescription: 'INTEREST PAID ON C/A', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '600030010', glDescription: 'FOREIGN CURRENCY SAVING DEPOSITS', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '600030012', glDescription: 'TELE BIRR MICRO SAVING INTEREST', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '600030013', glDescription: 'INTEREST PAID ON INVESTMENT SAVING DEPOSITS', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '600030017', glDescription: 'INTEREST PAID ON SPECIAL SAVING DEPOSIT', categoryGroup: '300 INTEREST EXPENSES' },

  // 310 Fees and Commission Expense
  { glCode: '600031001', glDescription: 'CORRESPONDENT CHARGES', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031002', glDescription: 'LEGAL FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031003', glDescription: 'MEMBERSHIP FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031005', glDescription: 'MOTOR VEHICLE INSPECTION FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031006', glDescription: 'NBE LICENSE FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031007', glDescription: 'POSTAGE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031008', glDescription: 'SUBSCRIPTION', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031009', glDescription: 'PROFESSIONAL SERVICE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031011', glDescription: 'BANK CHARGE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031012', glDescription: 'SWIFT CHARGE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031013', glDescription: 'BROAD BAND SERVICE FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031014', glDescription: 'VISA CHARGE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031015', glDescription: 'MUNICIPALITY SANITATION FEES', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031016', glDescription: 'VISA POS REIMBURSEMENT CHARGE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031017', glDescription: 'ANNUAL HARDWARE/SOFTWARE SERVICE FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031018', glDescription: 'CARD CHARGES', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031020', glDescription: 'ADAB / ADIB ISSUING & ACQUIRING COMM. CHARGES', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031026', glDescription: 'NBE FEES AND CHARGES ON RTGS AND CHEQUE TRANSACTIONS', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031028', glDescription: 'FOREIGN BORROWING PROCESSING FEES', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031029', glDescription: 'SERVICE FEE FOR POS FOR UNION PAY', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031031', glDescription: 'SERVICE FEE FOR POS FOR UNION PAY', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031032', glDescription: 'AMEX NETWORK FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031033', glDescription: 'VISA ISSUER FEE DEBIT AND CREDIT/ATM & POS TRANSACTIONS', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031034', glDescription: 'FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031035', glDescription: 'MERCHANT MAGENTO SERVICE FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031036', glDescription: 'AMEX POS ISSUER FEE FOR ATM & POS TRANSACTIONS', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '600031038', glDescription: 'CONTRACT EMPLOYEE SALARIES', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },

  // 340 Personnel Expense
  { glCode: '600034001', glDescription: 'CLERICAL STAFF SALARY', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034002', glDescription: 'NON-CLERICAL STAFF SALARY', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034003', glDescription: 'CASH INDEMNITY ALLOWANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034004', glDescription: 'DISTURBANCE ALLOWANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034005', glDescription: 'FUNERAL EXPENSE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034006', glDescription: 'HOUSING ALLOWANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034007', glDescription: 'HARDSHIP ALLOWANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034008', glDescription: 'MATERNITY PAY', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034009', glDescription: 'MEDICAL', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034010', glDescription: 'OVERTIME PAYMENTS', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034011', glDescription: 'PROVIDENT / TRUST FUNDS', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034012', glDescription: 'OPERATING LEASE RESIDENTIAL RENT', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034013', glDescription: 'STAFF INSURANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034014', glDescription: 'TRAINING AND EDUCATION', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034015', glDescription: 'UNIFORMS', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034016', glDescription: 'UTILITY ALLOWANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034017', glDescription: 'SPECIAL DUTY BENEFIT', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034019', glDescription: 'PENSION CONTRIBUTION', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034020', glDescription: 'TRANSPORT ALLOWANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034022', glDescription: 'LEAVE PAYMENT', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034023', glDescription: 'DEFINED BENEFIT PLAN - SEVERANCE PAYMENT', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034024', glDescription: 'SALARY BEN. REPRESENTATION ALLOW.', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034025', glDescription: 'BONUS', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034027', glDescription: 'MARRIAGE BENEFIT', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034028', glDescription: 'ACTING ALLOWANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034029', glDescription: 'PAYMENT IN SMART (NON-TAXABLE BENEFIT PAYMENT)', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034035', glDescription: 'COST ALLOWANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034036', glDescription: 'PAYMENT IN SMART', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034039', glDescription: 'LEAVE DEFICIT', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '600034056', glDescription: 'REIMBURSEMENT CONTRACT EMPLOYEE TRANSPORT', categoryGroup: '340 PERSONNEL EXPENSE' },

  // 350 Other Operating Expense
  { glCode: '600035001', glDescription: 'ADVERTISEMENT AND PROMOTION', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035002', glDescription: 'AUDIT FEES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035004', glDescription: 'CLEANING SUPPLIES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035007', glDescription: 'CORPORATE SOCIAL RESPONSIBILITY', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035008', glDescription: 'ENTERTAINMENT', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035010', glDescription: 'LAND AND BUILDING TAX', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035012', glDescription: 'LOSS ON DISP. OF ASSETS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035013', glDescription: 'REPAIR AND MAINTENANCE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035014', glDescription: 'LOSS ON FRGN. EXC.DEALINGS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035015', glDescription: 'RES. AND DESIGN BUILDING', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035016', glDescription: 'MAINT. AND SER. MOTOR VEHICLES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035017', glDescription: 'MAINT. AND SER. ELECTRICAL ITEMS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035021', glDescription: 'MAINT. AND SER. EQUIP AND FURNITURE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035022', glDescription: 'MAINT. AND SER. COMP. HARD AND SOFT WARE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035023', glDescription: 'SAFETY BAGS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035024', glDescription: 'MOTOR VEHICLES (LICENSING)', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035025', glDescription: 'MUNICIPALITY SANITATION FEES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035026', glDescription: 'PERDIEM', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035027', glDescription: 'PETROL AND OIL', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035028', glDescription: 'POSTAGE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035029', glDescription: 'OPERATING LEASE OFFICE RENT', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035030', glDescription: 'REVENUE STAMPS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035031', glDescription: 'STATIONERY AND PRINTING', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035032', glDescription: 'SUBSCRIPTION', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035033', glDescription: 'SUNDRIES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035034', glDescription: 'UTILITY', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035035', glDescription: 'TRANSPORTATION', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035037', glDescription: 'TRANSPORT OF CURRENCY', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035038', glDescription: 'WAGES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035039', glDescription: 'WATER AND LIGHT', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035040', glDescription: 'LOADING AND UNLOADING', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035042', glDescription: 'INSURANCE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035043', glDescription: 'COMPUTER SUPPLIES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035046', glDescription: 'REPRESENTATION ALLOWANCE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035047', glDescription: 'IMPAIRMENT CHARGES-LOANS AND ADVANCES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035048', glDescription: 'IMPAIRMENT CHARGE-RECEIVABLES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035050', glDescription: 'RECRUITMENT AND PROMOTION', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035053', glDescription: 'DIRECTORS FEE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035055', glDescription: 'LOSS ON DISPOSAL OF ASSETS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035057', glDescription: 'VISA CHARGES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035058', glDescription: 'POS REIMBURSEMENT CHARGE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035059', glDescription: 'NON CAPITALISED PROPERTY AND EQUIPMENT', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035060', glDescription: 'COST OF DEBIT CARD', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035061', glDescription: 'GEN. EXP. COST OF FIN MAKER', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035062', glDescription: 'OPERATING LEASE LAND EXPENSE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035063', glDescription: 'MASTERCARD CHARGE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035064', glDescription: 'MASTERCARD POS REIMBURSEMENT CHARGE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035068', glDescription: 'BOARD COMMITTEE & SECRETARY FEE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035070', glDescription: 'UNION PAY POS REIMBURSEMENT CHARGE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035071', glDescription: 'AMEX NETWORK FEE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035072', glDescription: 'SERVICE FEE FOR POS FOR UNION PAY', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035073', glDescription: 'SERVICE FEE FOR POS FOR UNION PAY', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035074', glDescription: 'AMEX NETWORK FEE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035075', glDescription: 'MOBILE WALLET INCENTIVE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035076', glDescription: 'AMEX GREEN CARD CASHBACK', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035077', glDescription: 'AMEX GOLD CARD CASHBACK', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035078', glDescription: 'COST OF AMEX GREEN CARD', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035079', glDescription: 'COST OF AMEX GOLD CARD', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035080', glDescription: 'AMEX CASHBACK', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035081', glDescription: 'GIFT MADE IN DASHEN BANK SHARES (AT PAR)', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035083', glDescription: 'ATM CLEANING SERVICE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035084', glDescription: 'REFERRAL MARKETING EXPENSE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035085', glDescription: 'COST OF DASHEN BRANDED CARD', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035086', glDescription: 'COST OF ETHSWITCH BRANDED CARD', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035095', glDescription: 'AMOLE EXPENSES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035096', glDescription: 'PENALTY CHARGE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035098', glDescription: 'GIFT', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035191', glDescription: 'PROVISION FOR FINANCIAL GUARANTEES AND COMMITMENTS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035192', glDescription: 'OTHER PROVISIONS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035193', glDescription: 'IMPAIRMENT LOSS ON NON-FINANCIAL ASSETS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035194', glDescription: 'OTHER EXPENSES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035195', glDescription: 'OUTBOUND DASHEN AMEX INTERCHANGE FEE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035196', glDescription: 'ETH-SWITCH', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035198', glDescription: 'DEPOSIT INSURANCE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '600035199', glDescription: 'CUSTOMER ACCOMMODATION EXP.', categoryGroup: '350 OTHER OPERATING EXPENSE' },

  // 360 Depreciation & Amortization
  { glCode: '600036001', glDescription: 'DEPRECIATION', categoryGroup: '360 DEPRECIATION AND AMORTIZATION' },
  { glCode: '600036002', glDescription: 'AMORTIZATION', categoryGroup: '360 DEPRECIATION AND AMORTIZATION' },
  { glCode: '600036007', glDescription: 'IMPAIRMENT LOSS CHARGE- RIGHT-OF-USE ASSETS', categoryGroup: '360 DEPRECIATION AND AMORTIZATION' },
];

export const IFB_GL_DATA = [
  // Fees and Commission Expense - i
  { glCode: '0000031102', glDescription: 'FOREIGN CURRENCY DEPOSIT CHARGE-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '0000031105', glDescription: 'MEMBERSHIP FEES-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '0000031109', glDescription: 'POSTAGE-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '0000031110', glDescription: 'SUBSCRIPTION-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '0000031112', glDescription: 'BANK CHARGES-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '0000031114', glDescription: 'BROAD BAND SERVICE-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '0000031115', glDescription: 'CARD CHARGES i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '0000031117', glDescription: 'ANNUAL HARD WARE & SOFT WARE SERVICE FEE-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '0000031118', glDescription: 'CONTRACT EMPLOYEE SALARIES-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '000000311',  glDescription: 'FEES AND COMMISSION EXPENSE- i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },

  // Personnel Expenses - i
  { glCode: '000034101', glDescription: 'CLERICAL STAFF SALARY-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034102', glDescription: 'NON-CLERICAL STAFF SALARY-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034103', glDescription: 'CASH INDEMNITY ALLOWANCE-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034104', glDescription: 'TRANSFER ALLOWANCE-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034106', glDescription: 'HOUSING ALLOWANCE-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034107', glDescription: 'HARDSHIP ALLOWANCE-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034108', glDescription: 'MATERNITY PAY-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034109', glDescription: 'MEDICAL-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034110', glDescription: 'OVERTIME PAYMENTS-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034111', glDescription: 'TRUST FUNDS EXPENSE-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034112', glDescription: 'RESIDENTIAL RENT-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034113', glDescription: 'STAFF INSURANCE-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034114', glDescription: 'TRAINING AND EDUCATION-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034115', glDescription: 'UNIFORMS-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034116', glDescription: 'UTILITY ALLOWANCE-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034117', glDescription: 'SALA. & ben - SPECIAL DUTY BENEFIT-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034119', glDescription: 'PENSION CONTRIBUTION-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034121', glDescription: 'SAL. BEN. - TRANSPORT ALLOWANCE-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034125', glDescription: 'SAL.& BEN. REPRESENTATION ALLOW.-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034129', glDescription: 'MARRIAGE BENEFIT-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034130', glDescription: 'ACTING ALLOWANCE-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034132', glDescription: 'DISTURBANCE ALLOWANCE-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000035136', glDescription: 'GEN.EXP-TRANSPORT ALLOWANCE-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000000341', glDescription: 'PERSONNEL EXPENSES - i', categoryGroup: '340 PERSONNEL EXPENSE - i' },

  // Other Operating Expense - i
  { glCode: '000030101', glDescription: 'UTBA EXPENSE-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000030116', glDescription: 'MUDARABAH DEPOSIT PROFIT & LOSS EXPENSE -i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000031103', glDescription: 'LEGAL-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000031104', glDescription: 'LOSS ON DISPOSAL OF ASSETS-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000031106', glDescription: 'MOTOR VEH.INSP.& CIRCUITS(ANN)-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000031107', glDescription: 'MUNICIPALITY SANITATION FEES-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035101', glDescription: 'ADVERTISEMENT AND PROMOTION-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035105', glDescription: 'CLEANING SUPPLIES-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035109', glDescription: 'ENTERTAINMENT-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035111', glDescription: 'REPAIR AND MAINTENANCE-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035122', glDescription: 'MONEY BAGS-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035126', glDescription: 'PERDIEM-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035127', glDescription: 'PETROL AND OIL-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035129', glDescription: 'OPERATING LEASE OFFICE RENT-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035130', glDescription: 'REVENUE STAMPS-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035131', glDescription: 'STATIONERY AND PRINTING-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035133', glDescription: 'SUNDRIES-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035134', glDescription: 'TEL.,TELG., TELEX & FAX-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035135', glDescription: 'TRANSPORTATION-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035137', glDescription: 'TRANSPORT OF CURRENCY-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035138', glDescription: 'WAGES-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035139', glDescription: 'WATER AND LIGHT-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035140', glDescription: 'LOADING AND UNLOADING-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035142', glDescription: 'GEN.EXP-PERDIEM & HOTEL ACCOMODA-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035143', glDescription: 'INSURANCE EXPENSE-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035144', glDescription: 'COMPUTER SUPPLIES-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035148', glDescription: 'IMPAIRMENT EXPENSE FOR RECEIVABLES- i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035149', glDescription: 'IMPAIRMENT EXPENSE FOR IFB FINANCING-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035151', glDescription: 'RECRUITMENT AND PROMOTION-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035153', glDescription: 'BAD DEBTS WRITTEN-OFF-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035160', glDescription: 'GEN. EXP. -NON CAPITALISED PROPERTY AND EQUIPMENT-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035163', glDescription: 'GEN. EXP. - LAND LEASE-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035195', glDescription: 'NON CAPITALISED PROPERTY AND EQUIPMENT-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035196', glDescription: 'GEN. EXP. - FORMAT-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035199', glDescription: 'DEPOSIT INSURANCE-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000000351', glDescription: 'OTHER OPERATING EXPENSE - i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },

  // Depreciation and Amortization - i
  { glCode: '000036101', glDescription: 'DEPRECIATION-RIGHT-OF-USE ASSETS - i', categoryGroup: '360 DEPRECIATION AND AMORTIZATION - i' },
  { glCode: '000036102', glDescription: 'DEPRECIATION-i', categoryGroup: '360 DEPRECIATION AND AMORTIZATION - i' },
  { glCode: '000000361', glDescription: 'DEPRECIATION AND AMORTIZATION - i', categoryGroup: '360 DEPRECIATION AND AMORTIZATION - i' },
];

@Injectable()
export class GlAccountService implements OnModuleInit {
  private readonly logger = new Logger(GlAccountService.name);

  constructor(
    @InjectRepository(GlAccount)
    private readonly glRepo: Repository<GlAccount>,
  ) {}

  async onModuleInit() {
    this.seedDefaultGls().catch((err) => {
      this.logger.error('Failed to seed default GL accounts: ' + err.message);
    });
  }

  async seedDefaultGls() {
    const count = await this.glRepo.count();
    if (count > 0) {
      this.logger.log(`GL accounts already present (${count} records). Ensuring all official Conventional & IFB GLs exist...`);
    } else {
      this.logger.log('Seeding official Conventional & IFB Expense GL Accounts master data...');
    }

    let seededCount = 0;

    for (const item of CONVENTIONAL_GL_DATA) {
      const exists = await this.glRepo.findOne({ where: { glCode: item.glCode } });
      if (!exists) {
        await this.glRepo.save(
          this.glRepo.create({
            glCode: item.glCode,
            glDescription: item.glDescription,
            categoryGroup: item.categoryGroup,
            bankingType: BankingType.CONVENTIONAL,
            isActive: true,
          }),
        );
        seededCount++;
      }
    }

    for (const item of IFB_GL_DATA) {
      const exists = await this.glRepo.findOne({ where: { glCode: item.glCode } });
      if (!exists) {
        await this.glRepo.save(
          this.glRepo.create({
            glCode: item.glCode,
            glDescription: item.glDescription,
            categoryGroup: item.categoryGroup,
            bankingType: BankingType.IFB,
            isActive: true,
          }),
        );
        seededCount++;
      }
    }

    this.logger.log(`✅ Seeded ${seededCount} official GL accounts (Conventional & IFB).`);
  }

  async findAll(bankingType?: BankingType, search?: string) {
    const qb = this.glRepo.createQueryBuilder('gl');
    if (bankingType) {
      qb.andWhere('gl.bankingType = :bankingType', { bankingType });
    }
    if (search) {
      qb.andWhere('(gl.glCode LIKE :s OR gl.glDescription LIKE :s OR gl.categoryGroup LIKE :s)', {
        s: `%${search}%`,
      });
    }
    qb.orderBy('gl.glCode', 'ASC');
    return qb.getMany();
  }

  async findByCode(glCode: string): Promise<GlAccount | null> {
    return this.glRepo.findOne({ where: { glCode } });
  }

  async create(data: { glCode: string; glDescription: string; bankingType: BankingType; categoryGroup?: string }): Promise<GlAccount> {
    const existing = await this.glRepo.findOne({ where: { glCode: data.glCode } });
    if (existing) {
      existing.glDescription = data.glDescription;
      existing.bankingType = data.bankingType;
      if (data.categoryGroup) existing.categoryGroup = data.categoryGroup;
      return this.glRepo.save(existing);
    }
    const newGl = this.glRepo.create(data);
    return this.glRepo.save(newGl);
  }

  async processGlImport(buffer: Buffer, bankingType: BankingType): Promise<{ inserted: number; updated: number; errors: string[] }> {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

    if (!rows.length) throw new BadRequestException('Uploaded file is empty');

    let inserted = 0;
    let updated = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const glCode = String(row['GL Code'] || row['glCode'] || row['GL'] || row['Code'] || '').trim();
        const glDescription = String(row['GL Description'] || row['glDescription'] || row['Description'] || row['Name'] || '').trim();
        const categoryGroup = row['Category'] || row['Group'] || row['categoryGroup'] || null;

        if (!glCode || !glDescription) {
          errors.push(`Row ${i + 2}: Missing GL Code or Description`);
          continue;
        }

        const existing = await this.glRepo.findOne({ where: { glCode } });
        if (existing) {
          existing.glDescription = glDescription;
          existing.bankingType = bankingType;
          if (categoryGroup) existing.categoryGroup = categoryGroup;
          await this.glRepo.save(existing);
          updated++;
        } else {
          const newGl = this.glRepo.create({
            glCode,
            glDescription,
            bankingType,
            categoryGroup,
            isActive: true,
          });
          await this.glRepo.save(newGl);
          inserted++;
        }
      } catch (err) {
        errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }

    return { inserted, updated, errors };
  }
}
