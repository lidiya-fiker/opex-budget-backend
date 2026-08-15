import { Injectable, BadRequestException, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlAccount, BankingType } from '../entities/gl-account.entity';
import * as XLSX from 'xlsx';

export const CONVENTIONAL_GL_DATA = [
  // 300 Interest Expenses
  { glCode: '000030001', glDescription: 'DEPOSIT AT NOTICE', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '000030002', glDescription: 'SAVINGS DEPOSITS', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '000030003', glDescription: 'FIXED DEPOSITS', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '000030005', glDescription: 'CORRESPONDENTS', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '000030007', glDescription: 'LOCAL BANK LOAN A/C', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '000030008', glDescription: 'FOREIGN BANK LOANS', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '000030009', glDescription: 'INTEREST PAID ON C/A', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '000030010', glDescription: 'FOREIGN CURRENCY SAVING DEPOSITS', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '000030011', glDescription: 'INTEREST CHARGE ON LEASE LIABILITY', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '000030012', glDescription: 'TELL BIRR MICRO SAVING INTEREST', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '000030013', glDescription: 'INTEREST PAID ON INVESTMENT SAVING DEPOSITS', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '000030014', glDescription: 'CORPORATE BOND', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '000030101', glDescription: 'HIBA EXPENSE', categoryGroup: '300 INTEREST EXPENSES' },
  { glCode: '000030116', glDescription: 'Mudarabah deposit profit & loss expense', categoryGroup: '300 INTEREST EXPENSES' },

  // 310 Fees and Commission Expense
  { glCode: '000031001', glDescription: 'CORRESPONDENT CHARGES', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031002', glDescription: 'LEGAL FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031003', glDescription: 'MEMBERSHIP FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031004', glDescription: 'FOREIGN CURRENCY DEPOSIT CHARGE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031005', glDescription: 'MOTOR VEHICLE INSPECTION FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031006', glDescription: 'NBE LICENSE FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031007', glDescription: 'POSTAGE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031008', glDescription: 'SUBSCRIPTION', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031009', glDescription: 'PROFESSIONAL SERVICE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031011', glDescription: 'BANK CHARGE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031012', glDescription: 'SWIFT CHARGE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031013', glDescription: 'BROAD BAND SERVICE FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031014', glDescription: 'VISA CHARGE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031015', glDescription: 'MUNICIPALITY SANITATION FEES', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031016', glDescription: 'VISA POS REIMBURSEMENT CHARGE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031017', glDescription: 'ANNUAL HARDWARE/SOFTWARE SERVICE FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031018', glDescription: 'CARD CHARGES', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031019', glDescription: 'MASTERCARD POS REIMBURSEMENT CHARGE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031020', glDescription: 'POS REIMBURSEMENT CHARGE UNION PAY', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031021', glDescription: 'SERVICE FEE FOR ATM ON UNION PAY', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031022', glDescription: 'SERVICE FEE FOR POS ON UNION PAY', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031023', glDescription: 'AMEX NETWORK FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031024', glDescription: 'ETH SWICH CLEARING AND SETTLMENT SERVICE FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031025', glDescription: 'MERCHANTS/AGENTS SERVICE FEE', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031026', glDescription: 'NBE FEES & CHARGES ON RTGS & CHEQUE TRANSACTION', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },
  { glCode: '000031028', glDescription: 'FOREIGN BORROWING PROCESSING FEES', categoryGroup: '310 FEES AND COMMISSION EXPENSE' },

  // 340 Personnel Expense
  { glCode: '000034018', glDescription: 'CONTRACT EMPLOYEE SALARIES', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034001', glDescription: 'CLERICAL STAFF SALARY', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034002', glDescription: 'NON-CLERICAL STAFF SALARY', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034003', glDescription: 'CASH INDEMNITY ALLOWANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034004', glDescription: 'DISTURBANCE ALLOWANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034005', glDescription: 'FUNERAL EXPENSE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034006', glDescription: 'HOUSING ALLOWANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034007', glDescription: 'HARDSHIP ALLOWNACE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034008', glDescription: 'MATERNITY PAY', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034009', glDescription: 'MEDICAL', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034010', glDescription: 'OVERTIME PAYMENTS', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034011', glDescription: 'PROVIDENT / TRUST FUNDS', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034012', glDescription: 'OPERATING LEASE RESIDENTIAL RENT', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034013', glDescription: 'STAFF INSURANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034014', glDescription: 'TRAINING AND EDUCATION', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034015', glDescription: 'UNIFORMS', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034016', glDescription: 'UTILITY ALLOWANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034017', glDescription: 'SPECIAL DUTY BENEFIT', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034019', glDescription: 'PENSION CONTRIBUTION', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034020', glDescription: 'TRANSPORT ALLOWANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034022', glDescription: 'LEAVE PAYMENT', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034023', glDescription: 'DEFINED BENEFIT PLAN - SEVERANCE PAYMENT', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034024', glDescription: 'SAL.& BEN. REPRESENTATION ALLOW.', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034025', glDescription: 'BONUS', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034027', glDescription: 'MARRIAGE BENEFIT', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034028', glDescription: 'ACTING ALLOWANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034029', glDescription: 'PAYMENT DEFINED BENEFIT PLAN - GRATUITY PAYMENT', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034033', glDescription: 'NON ACCUMULATING PAID ABSENCES', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034035', glDescription: 'COURT ALLOWANCE', categoryGroup: '340 PERSONNEL EXPENSE' },
  { glCode: '000034038', glDescription: 'PAYMENT IN SHARE', categoryGroup: '340 PERSONNEL EXPENSE' },

  // 350 Other Operating Expense
  { glCode: '000035001', glDescription: 'ADVERTISEMENT AND PROMOTION', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035002', glDescription: 'AUDIT FEES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035004', glDescription: 'CLEANING SUPPLIES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035007', glDescription: 'CORPORATE SOCIAL RESPONSIBILITY', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035008', glDescription: 'ENTERTAINMENT', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035010', glDescription: 'LAND AND BUILDING TAX', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035012', glDescription: 'LOSS ON DIS.OF OLD ASSETS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035013', glDescription: 'REPAIR AND MAINTENANCE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035014', glDescription: 'LOSS ON FRGN. EXC.DEALINGS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035015', glDescription: 'RES. AND MAIN. BUILDING', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035016', glDescription: 'MAIN. AND REP. MOTOR VEHICLES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035017', glDescription: 'INSTAL. AND REP. ELECTRICAL ITEMS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035018', glDescription: 'MAIN. AND REP. EQUIP. AND FURNITURES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035019', glDescription: 'MAIN. AND REP. COMP. HARD AND SOFT WARE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035021', glDescription: 'MONEY BAGS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035022', glDescription: 'MOTOR VECH.INSP.& CIRCFEESANN)', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035024', glDescription: 'MUNICIPALITY SANITATION FEES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035026', glDescription: 'PERDIEM', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035027', glDescription: 'PETROL AND OIL', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035028', glDescription: 'POSTAGE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035029', glDescription: 'OPERATING LEASE OFFICE RENT', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035030', glDescription: 'REVENUE STAMPS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035031', glDescription: 'STATIONERY AND PRINTING', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035032', glDescription: 'SUBSCRIPTION', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035033', glDescription: 'SUNDRIES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035034', glDescription: 'UTILITY', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035035', glDescription: 'TRANSPORTATION', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035037', glDescription: 'TRANSPORT OF CURRENCY', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035038', glDescription: 'WAGES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035039', glDescription: 'WATER AND LIGHT', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035040', glDescription: 'LOADING AND UNLOADING', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035042', glDescription: 'INSURANCE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035043', glDescription: 'COMPUTER SUPPLIES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035046', glDescription: 'REPRESENTATION ALLOWANCE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035047', glDescription: 'IMPAIRMENT CHARGE-LOANS AND ADVANCES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035048', glDescription: 'IMPAIRMENT CHARGE-RECEIVABLES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035050', glDescription: 'RECRUITMENT AND PROMOTION', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035053', glDescription: 'DIRECTORS FEE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035055', glDescription: 'LOSS ON DISPOSAL OF ASSETS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035056', glDescription: 'VISA CHARGES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035057', glDescription: 'POS REIMBURSEMENT CHARGE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035059', glDescription: 'NON CAPITALISED PROPERTY AND EQUIPMENT', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035060', glDescription: 'COST OF DEBIT CARD', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035061', glDescription: 'GEN. EXP. COST OF PIN MAILER', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035062', glDescription: 'OPERATING LEASE LAND EXPENSE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035063', glDescription: 'MASTERCARD CHARGE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035064', glDescription: 'MASTERCARD POS REIMBURSEMENT CHARGE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035068', glDescription: 'BOARD COMMITTEE & SECRETARY FEE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035069', glDescription: 'UNION PAY POS REIMBURSEMENT CHARGE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035071', glDescription: 'AMEX NETWORK RATE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035072', glDescription: 'SERVICE FEE FOR ATM ON UNION PAY', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035073', glDescription: 'SERVICE FEE FOR POS ON UNION PAY', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035074', glDescription: 'AMEX NETWORK FEE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035075', glDescription: 'MOBILE WALLET EXPENSE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035076', glDescription: 'AMEX GREEN CARD CASH BACK', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035077', glDescription: 'AMEX GOLD CARD CASH BACK', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035078', glDescription: 'COST OF AMEX GREEN CARD', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035079', glDescription: 'COST OF AMEX GOLD CARD', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035080', glDescription: 'AMEX CASH BACK', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035081', glDescription: 'GIFT MADE IN DASHEN BANK SHARES (AT PAR)', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035083', glDescription: 'ATM CLEANING SERVICE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035084', glDescription: 'REFERRAL MARKETING EXPENSE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035093', glDescription: 'COST OF DASHEN BRANDED CARD', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035094', glDescription: 'COST OF ETTA COBRANDED CARD', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035095', glDescription: 'AMOLE EXPENSES', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035096', glDescription: 'PENALTY CHARGE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035098', glDescription: 'GIFT', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035099', glDescription: 'COST OF GIFT CARD (ID CARD PRODUCTION COST)', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035191', glDescription: 'IMPAIRMENT LOSS ON NON-FINANCIAL ASSETS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035192', glDescription: 'OTHER PROVISIONS', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035193', glDescription: 'OUT BOUND DASHEN AMEX INTERCHANGE FEE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035194', glDescription: 'FORMAT', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035198', glDescription: 'DEPOSIT INSURANCE', categoryGroup: '350 OTHER OPERATING EXPENSE' },
  { glCode: '000035201', glDescription: 'CUSTOMER COMMUNICATION', categoryGroup: '350 OTHER OPERATING EXPENSE' },

  // 360 Depreciation & Amortization
  { glCode: '000036001', glDescription: 'DEPRECIATION', categoryGroup: '360 DEPRECIATION AND AMORTIZATION' },
  { glCode: '000036002', glDescription: 'AMORTIZATION', categoryGroup: '360 DEPRECIATION AND AMORTIZATION' },
  { glCode: '000036003', glDescription: 'DEPRECIATION-RIGHT-OF-USE ASSETS', categoryGroup: '360 DEPRECIATION AND AMORTIZATION' },
];

export const IFB_GL_DATA = [
  // Fees and Commission Expense - i
  { glCode: '000031102', glDescription: 'FOREIGN CURRENCY DEPOSIT CHARGE-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '000031105', glDescription: 'MEMBERSHIP FEES-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '000031109', glDescription: 'POSTAGE-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '000031110', glDescription: 'SUBSCRIPTION-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '000031112', glDescription: 'BANK CHARGES-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '000031114', glDescription: 'BROAD BAND SERVICE-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '000031115', glDescription: 'CARD CHARGES i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '000031117', glDescription: 'ANNUAL HARD WARE & SOFT WARE SERVICE FEE-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '000034118', glDescription: 'CONTRACT EMPLOYEE SALARIES-i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },
  { glCode: '000000311', glDescription: 'FEES AND COMMISSION EXPENSE- i', categoryGroup: '310 FEES AND COMMISSION EXPENSE - i' },

  // Personnel Expenses - i
  { glCode: '000034101', glDescription: 'CLERICAL STAFF SALARY-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034102', glDescription: 'NON-CLERICAL STAFF SALARY-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
  { glCode: '000034103', glDescription: 'CASH INDEMINITY ALLOWANCE-i', categoryGroup: '340 PERSONNEL EXPENSE - i' },
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
  { glCode: '000030101-i', glDescription: 'HIBA EXPENSE-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000030116-i', glDescription: 'MUDARABAH DEPOSIT PROFIT & LOSS EXPENSE -i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000031103', glDescription: 'LEGAL-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000031104', glDescription: 'LOSS ON DISPOSAL OF ASSETS-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000031106', glDescription: 'MOTOR VECH.INSP.& CIRCFEES(ANN)-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000031107', glDescription: 'MUNICIPALITY SANITATION FEES-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035101', glDescription: 'ADVERTISEMENT AND PROMOTION-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035105', glDescription: 'CLEANING SUPPLIES-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035109', glDescription: 'ENTERTAINMENT-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035111', glDescription: 'REPAIR AND MAINTENANCE-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035122', glDescription: 'MONEY BAGS-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035126', glDescription: 'PERDIEM-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035127', glDescription: 'PETROL AND OIL-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035129', glDescription: 'OPERATING LEASE OFFICE RENT- i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035130', glDescription: 'REVENUE STAMPS-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035131', glDescription: 'STATIONERY AND PRINTING-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035133', glDescription: 'SUNDRIES-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035134', glDescription: 'TEL.,TELG., TELEX & FAX-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035135', glDescription: 'TRANSPORTATION-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035137', glDescription: 'TRANSPORT OF CURRENCY-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035138', glDescription: 'WAGES-i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
  { glCode: '000035139', glDescription: 'WATER AND LIGHT- i', categoryGroup: '350 OTHER OPERATING EXPENSE - i' },
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
    this.logger.log('Syncing official Conventional & IFB Expense GL Accounts master data...');
    let seededCount = 0;
    let updatedCount = 0;

    const validConventionalCodes = new Set(CONVENTIONAL_GL_DATA.map((d) => d.glCode));
    const validIfbCodes = new Set(IFB_GL_DATA.map((d) => d.glCode));

    for (const item of CONVENTIONAL_GL_DATA) {
      const existing = await this.glRepo.findOne({ where: { glCode: item.glCode, bankingType: BankingType.CONVENTIONAL } });
      if (!existing) {
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
      } else {
        existing.glDescription = item.glDescription;
        existing.categoryGroup = item.categoryGroup;
        existing.bankingType = BankingType.CONVENTIONAL;
        existing.isActive = true;
        await this.glRepo.save(existing);
        updatedCount++;
      }
    }

    for (const item of IFB_GL_DATA) {
      const existing = await this.glRepo.findOne({ where: { glCode: item.glCode, bankingType: BankingType.IFB } });
      if (!existing) {
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
      } else {
        existing.glDescription = item.glDescription;
        existing.categoryGroup = item.categoryGroup;
        existing.bankingType = BankingType.IFB;
        existing.isActive = true;
        await this.glRepo.save(existing);
        updatedCount++;
      }
    }

    // Clean up all extra / stale GL accounts that are NOT in official master lists
    const allDbGls = await this.glRepo.find();
    let cleanedCount = 0;
    for (const gl of allDbGls) {
      const isValidConventional = gl.bankingType === BankingType.CONVENTIONAL && validConventionalCodes.has(gl.glCode);
      const isValidIfb = gl.bankingType === BankingType.IFB && validIfbCodes.has(gl.glCode);

      if (!isValidConventional && !isValidIfb) {
        try {
          await this.glRepo.remove(gl);
          cleanedCount++;
        } catch (err) {
          gl.isActive = false;
          await this.glRepo.save(gl);
          cleanedCount++;
        }
      }
    }

    this.logger.log(`✅ Synced GL master data: ${seededCount} inserted, ${updatedCount} updated, ${cleanedCount} legacy records purged/deactivated.`);
  }

  async findAll(bankingType?: BankingType, search?: string) {
    const qb = this.glRepo.createQueryBuilder('gl');
    qb.andWhere('gl.isActive = :active', { active: true });
    if (bankingType) {
      qb.andWhere('gl.bankingType = :bankingType', { bankingType });
    }
    if (search) {
      qb.andWhere('(gl.glCode LIKE :s OR gl.glDescription LIKE :s OR gl.categoryGroup LIKE :s)', {
        s: `%${search}%`,
      });
    }
    // Maintain strict non-mixed order: CONVENTIONAL first, then IFB, preserving exact master seed order
    qb.orderBy('gl.bankingType', 'ASC');
    qb.addOrderBy('gl.id', 'ASC');
    return qb.getMany();
  }

  async findByCode(glCode: string): Promise<GlAccount | null> {
    return this.glRepo.findOne({ where: { glCode } });
  }

  async create(data: { glCode: string; glDescription: string; bankingType: BankingType; categoryGroup?: string }): Promise<GlAccount> {
    const existing = await this.glRepo.findOne({ where: { glCode: data.glCode, bankingType: data.bankingType } });
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

        const existing = await this.glRepo.findOne({ where: { glCode, bankingType } });
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
