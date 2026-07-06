import { createContext, useContext, useReducer, ReactNode } from "react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type AccountType   = "Savings" | "Current" | "Salary" | "NRE";
export type AccountStatus = "Active" | "Frozen" | "Dormant";
export type TxnType       = "credit" | "debit";
export type TxnStatus     = "Completed" | "Processing" | "Failed" | "Flagged" | "Disputed" | "Reversed";
export type TxnChannel    = "UPI" | "NEFT" | "IMPS" | "RTGS" | "Card" | "ATM" | "Wallet" | "SWIFT" | "NACH";
export type TxnCategory   = "upi" | "card" | "transfer" | "emi" | "wallet" | "cash";
export type CardType      = "Debit" | "Credit";
export type CardNetwork   = "Visa" | "Mastercard" | "RuPay";
export type LoanStatus    = "Active" | "Closed" | "Approved" | "Pending" | "Counter-Offer";
export type DepositType   = "FD" | "RD";
export type FundCategory  = "Equity" | "Debt" | "Hybrid" | "Index";
export type RiskLevel     = "Low" | "Moderate" | "High";
export type RewardTier    = "Bronze" | "Silver" | "Gold" | "Platinum";
export type TicketStatus  = "Open" | "In Progress" | "Resolved" | "Closed";
export type NotifType     = "transaction" | "security" | "loan" | "kyc" | "offer" | "reward";

export interface User {
  id: string; name: string; mobile: string; email: string;
  dob: string; panMasked: string; address: string;
  kycStatus: "approved" | "pending" | "rejected";
  kycTier: "Min KYC" | "Full KYC";
  creditScore: number; creditScoreCategory: string;
  upiId: string; nominee: string;
  accountTier: "essential" | "savings" | "prime";
}

export interface Account {
  id: string; type: AccountType; nickname: string;
  numberMasked: string; numberFull: string; ifsc: string;
  balance: number; availableBalance: number; holdAmount: number;
  status: AccountStatus; openedDate: string; interestRate: number;
  dailyTransferLimit: number; dailyWithdrawalLimit: number;
}

export interface Transaction {
  id: string; accountId: string; type: TxnType; category: TxnCategory;
  description: string; counterparty: string; amount: number;
  runningBalance: number; date: string; time: string;
  status: TxnStatus; channel: TxnChannel; reference: string;
  notes: string; fraudFlag: boolean; disputeId?: string;
}

export interface Card {
  id: string; type: CardType; network: CardNetwork;
  numberMasked: string; holder: string; expiry: string;
  linkedAccountId: string; frozen: boolean; color: string;
  controls: { online: boolean; contactless: boolean; atm: boolean; international: boolean };
  limits: { online: number; contactless: number; atm: number; international: number };
  creditLimit?: number; availableCredit?: number;
  dueDate?: string; minDue?: number; totalDue?: number;
}

export interface SavingsPot {
  id: string; name: string; emoji: string; color: string;
  targetAmount: number; currentAmount: number;
  targetDate: string; autoSaveAmount: number;
  autoSaveFrequency: "weekly" | "monthly" | "none";
  createdDate: string;
}

export interface Deposit {
  id: string; type: DepositType; principal: number;
  interestRate: number; tenureMonths: number;
  startDate: string; maturityDate: string; maturityAmount: number;
  status: "Active" | "Matured" | "Closed";
  monthlyAmount?: number; // RD only
  linkedAccountId: string;
}

export interface Loan {
  id: string; type: string; principalAmount: number;
  outstandingAmount: number; interestRate: number;
  tenureMonths: number; remainingMonths: number;
  emiAmount: number; emiDueDay: number; nextEmiDate: string;
  status: LoanStatus; autoDebitEnabled: boolean;
  totalPaid: number; disbursedDate: string;
}

export interface MutualFund {
  id: string; name: string; house: string; category: FundCategory;
  nav: number; returns1Y: number; returns3Y: number; returns5Y: number;
  minSIP: number; minLumpsum: number; riskLevel: RiskLevel;
  aum: string; expenseRatio: number;
}

export interface Holding {
  fundId: string; units: number; avgNav: number; currentNav: number;
  investedAmount: number; currentValue: number;
  returns: number; returnsPercent: number;
  sipAmount?: number; sipDate?: number; isSIP: boolean;
}

export interface GoldHolding {
  grams: number; avgBuyPrice: number; currentPrice: number;
  investedAmount: number; currentValue: number;
}

export interface RewardEvent {
  id: string; description: string; points: number;
  type: "earned" | "redeemed"; date: string;
}

export interface RewardVoucher {
  id: string; brand: string; description: string;
  pointsCost: number; value: string; category: string; emoji: string;
}

export interface Budget {
  category: string; limit: number; spent: number; emoji: string;
}

export interface Payee {
  id: string; name: string; bank: string;
  accountMasked: string; ifsc: string; upiId: string;
  cooling: "verified" | "cooling" | "unverified"; addedDate: string;
}

export interface Notification {
  id: string; type: NotifType; title: string; body: string;
  time: string; read: boolean; deepLink?: string;
}

export interface SupportTicket {
  id: string; subject: string; category: string;
  status: TicketStatus; createdDate: string; lastUpdate: string;
  messages: { id: string; from: "user" | "support"; text: string; time: string }[];
}

export interface ChatMessage {
  id: string; from: "user" | "ai"; text: string; time: string;
}

export interface FraudAlert {
  id: string; txnId: string; severity: "low" | "medium" | "high";
  description: string; date: string; time: string;
  status: string; caseRef: string; autoFrozen: boolean;
}

export interface Dispute {
  id: string; txnId: string; reason: string; amount: number;
  filedOn: string; status: string; expectedResolutionBy: string;
  updates: { date: string; time: string; note: string }[];
}

export interface UPIMandate {
  id: string; merchant: string; amountCap: number;
  frequency: string; nextDebit: string; status: "Active" | "Paused" | "Cancelled";
}

export interface CollectRequest {
  id: string; from: string; upiId: string;
  amount: number; note: string; expiresIn: string; status: "Open" | "Paid" | "Declined";
}

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────

export interface AppState {
  user: User;
  accounts: Account[];
  transactions: Transaction[];
  cards: Card[];
  pots: SavingsPot[];
  deposits: Deposit[];
  loans: Loan[];
  mutualFunds: MutualFund[];
  holdings: Holding[];
  goldHolding: GoldHolding;
  rewards: { points: number; tier: RewardTier; history: RewardEvent[] };
  vouchers: RewardVoucher[];
  budgets: Budget[];
  payees: Payee[];
  notifications: Notification[];
  tickets: SupportTicket[];
  chatMessages: ChatMessage[];
  fraudAlerts: FraudAlert[];
  disputes: Dispute[];
  upiMandates: UPIMandate[];
  collectRequests: CollectRequest[];
}

// ─────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────

const IFSC = "MERD0000123";

const initialState: AppState = {
  user: {
    id: "CUS-2024-08847", name: "Priya Sharma",
    mobile: "+91 98765 43210", email: "priya.sharma@example.com",
    dob: "15 Mar 1990", panMasked: "AXXXX1234K",
    address: "B-402, Skyline Residency, Bandra West, Mumbai – 400050",
    kycStatus: "approved", kycTier: "Full KYC",
    creditScore: 748, creditScoreCategory: "Good",
    upiId: "priya.sharma@meridian", nominee: "Rahul Sharma (Spouse)",
    accountTier: "savings",
  },

  accounts: [
    {
      id: "ACC-SVG-001", type: "Savings", nickname: "Everyday Savings",
      numberMasked: "••4821", numberFull: "5081 2379 4821", ifsc: IFSC,
      balance: 384520.75, availableBalance: 382520.75, holdAmount: 2000,
      status: "Active", openedDate: "12 Jan 2019", interestRate: 3.5,
      dailyTransferLimit: 500000, dailyWithdrawalLimit: 100000,
    },
    {
      id: "ACC-CUR-002", type: "Current", nickname: "Business – Sharma Consulting",
      numberMasked: "••0092", numberFull: "5081 4489 0092", ifsc: IFSC,
      balance: 128450.0, availableBalance: 128450.0, holdAmount: 0,
      status: "Active", openedDate: "05 Aug 2021", interestRate: 0,
      dailyTransferLimit: 2000000, dailyWithdrawalLimit: 200000,
    },
  ],

  transactions: [
    { id: "TXN-001", accountId: "ACC-SVG-001", type: "debit", category: "upi", description: "Amazon India", counterparty: "Amazon Seller Services", amount: 2499, runningBalance: 384520.75, date: "05 Jul 2024", time: "14:32", status: "Completed", channel: "UPI", reference: "UPI/424932100181/Amazon", notes: "", fraudFlag: false },
    { id: "TXN-002", accountId: "ACC-SVG-001", type: "credit", category: "transfer", description: "Salary – Infosys Ltd", counterparty: "Infosys Limited", amount: 185000, runningBalance: 387019.75, date: "01 Jul 2024", time: "09:15", status: "Completed", channel: "NEFT", reference: "NEFT/N241830/INFOSY", notes: "July 2024 Salary", fraudFlag: false },
    { id: "TXN-003", accountId: "ACC-SVG-001", type: "debit", category: "upi", description: "Swiggy", counterparty: "Swiggy Bundl Technologies", amount: 648, runningBalance: 202019.75, date: "04 Jul 2024", time: "20:10", status: "Completed", channel: "UPI", reference: "UPI/424720081122/Swiggy", notes: "", fraudFlag: false },
    { id: "TXN-004", accountId: "ACC-SVG-001", type: "debit", category: "emi", description: "EMI – Home Loan", counterparty: "Meridian Bank Loans", amount: 30714, runningBalance: 202667.75, date: "10 Jul 2024", time: "11:00", status: "Processing", channel: "NACH", reference: "NACH/EMI/LN-004421/07", notes: "Auto-debit mandate", fraudFlag: false },
    { id: "TXN-005", accountId: "ACC-SVG-001", type: "debit", category: "transfer", description: "Wire to John Smith", counterparty: "John Smith – JPMorgan Chase", amount: 41250, runningBalance: 233381.75, date: "02 Jul 2024", time: "16:45", status: "Processing", channel: "SWIFT", reference: "SWIFT/MT103/241830982", notes: "Freelance payment USD 500", fraudFlag: false },
    { id: "TXN-006", accountId: "ACC-SVG-001", type: "debit", category: "cash", description: "ATM Withdrawal", counterparty: "Meridian ATM – Linking Road", amount: 10000, runningBalance: 274631.75, date: "30 Jun 2024", time: "18:22", status: "Completed", channel: "ATM", reference: "ATM/667443/BNDR", notes: "", fraudFlag: false },
    { id: "TXN-007", accountId: "ACC-SVG-001", type: "debit", category: "transfer", description: "Transfer to Unknown", counterparty: "Unverified merchant", amount: 24500, runningBalance: 284631.75, date: "29 Jun 2024", time: "03:12", status: "Flagged", channel: "IMPS", reference: "IMPS/334455812/UNK", notes: "Flagged by fraud rule", fraudFlag: true, disputeId: "DIS-2024-00021" },
    { id: "TXN-008", accountId: "ACC-SVG-001", type: "credit", category: "transfer", description: "Freelance – Upwork", counterparty: "Upwork Escrow Inc.", amount: 42800, runningBalance: 309131.75, date: "28 Jun 2024", time: "12:30", status: "Completed", channel: "NEFT", reference: "NEFT/N241790/UPWORK", notes: "June project", fraudFlag: false },
    { id: "TXN-009", accountId: "ACC-SVG-001", type: "debit", category: "upi", description: "BEST Electricity", counterparty: "BEST Undertaking", amount: 3840, runningBalance: 266331.75, date: "27 Jun 2024", time: "10:00", status: "Completed", channel: "UPI", reference: "UPI/424690112233/BEST", notes: "", fraudFlag: false },
    { id: "TXN-010", accountId: "ACC-SVG-001", type: "debit", category: "card", description: "Zomato", counterparty: "Zomato Ltd", amount: 892, runningBalance: 285171.75, date: "24 Jun 2024", time: "21:44", status: "Completed", channel: "Card", reference: "POS/ZOMATO/241760", notes: "", fraudFlag: false },
    { id: "TXN-011", accountId: "ACC-SVG-001", type: "debit", category: "wallet", description: "Wallet Top-up", counterparty: "Meridian Wallet", amount: 2000, runningBalance: 286063.75, date: "24 Jun 2024", time: "08:12", status: "Completed", channel: "Wallet", reference: "WLT/TOPUP/889221", notes: "", fraudFlag: false },
    { id: "TXN-012", accountId: "ACC-SVG-001", type: "debit", category: "transfer", description: "SIP – Axis Bluechip", counterparty: "Axis MF", amount: 15000, runningBalance: 270171.75, date: "25 Jun 2024", time: "09:00", status: "Failed", channel: "NACH", reference: "NACH/SIP/AXIS/06", notes: "Insufficient balance", fraudFlag: false },
  ],

  cards: [
    {
      id: "CARD-001", type: "Debit", network: "Visa",
      numberMasked: "•••• •••• •••• 4821", holder: "PRIYA SHARMA", expiry: "08/27",
      linkedAccountId: "ACC-SVG-001", frozen: false, color: "#0E1B33",
      controls: { online: true, contactless: true, atm: true, international: false },
      limits: { online: 50000, contactless: 5000, atm: 50000, international: 25000 },
    },
    {
      id: "CARD-002", type: "Credit", network: "Mastercard",
      numberMasked: "•••• •••• •••• 6612", holder: "PRIYA SHARMA", expiry: "11/26",
      linkedAccountId: "ACC-SVG-001", frozen: false, color: "#4A2EC4",
      controls: { online: true, contactless: true, atm: true, international: true },
      limits: { online: 100000, contactless: 5000, atm: 20000, international: 100000 },
      creditLimit: 300000, availableCredit: 218450,
      dueDate: "15 Jul 2024", minDue: 8420, totalDue: 81550,
    },
  ],

  pots: [
    { id: "POT-001", name: "Goa Trip", emoji: "✈️", color: "#4A2EC4", targetAmount: 80000, currentAmount: 45000, targetDate: "Dec 2024", autoSaveAmount: 5000, autoSaveFrequency: "monthly", createdDate: "01 Mar 2024" },
    { id: "POT-002", name: "New MacBook", emoji: "💻", color: "#059669", targetAmount: 150000, currentAmount: 90000, targetDate: "Sep 2024", autoSaveAmount: 10000, autoSaveFrequency: "monthly", createdDate: "15 Jan 2024" },
    { id: "POT-003", name: "Emergency Fund", emoji: "🛡️", color: "#D97706", targetAmount: 300000, currentAmount: 180000, targetDate: "Dec 2025", autoSaveAmount: 8000, autoSaveFrequency: "monthly", createdDate: "01 Jan 2024" },
  ],

  deposits: [
    { id: "FD-001", type: "FD", principal: 200000, interestRate: 7.25, tenureMonths: 12, startDate: "01 Jan 2024", maturityDate: "01 Jan 2025", maturityAmount: 214500, status: "Active", linkedAccountId: "ACC-SVG-001" },
    { id: "FD-002", type: "FD", principal: 100000, interestRate: 7.0, tenureMonths: 24, startDate: "15 Mar 2023", maturityDate: "15 Mar 2025", maturityAmount: 115000, status: "Active", linkedAccountId: "ACC-SVG-001" },
    { id: "RD-001", type: "RD", principal: 60000, interestRate: 6.8, tenureMonths: 12, startDate: "01 Apr 2024", maturityDate: "01 Apr 2025", maturityAmount: 62200, status: "Active", monthlyAmount: 5000, linkedAccountId: "ACC-SVG-001" },
  ],

  loans: [
    { id: "LN-2023-004421", type: "Home Loan", principalAmount: 4500000, outstandingAmount: 3874500, interestRate: 8.5, tenureMonths: 240, remainingMonths: 202, emiAmount: 30714, emiDueDay: 10, nextEmiDate: "10 Aug 2024", status: "Active", autoDebitEnabled: true, totalPaid: 625500, disbursedDate: "15 Mar 2023" },
    { id: "APP-2024-00781", type: "Personal Loan", principalAmount: 800000, outstandingAmount: 650000, interestRate: 11.25, tenureMonths: 48, remainingMonths: 48, emiAmount: 16878, emiDueDay: 5, nextEmiDate: "05 Aug 2024", status: "Counter-Offer", autoDebitEnabled: false, totalPaid: 0, disbursedDate: "" },
  ],

  mutualFunds: [
    { id: "MF-001", name: "Axis Bluechip Fund", house: "Axis MF", category: "Equity", nav: 52.34, returns1Y: 18.4, returns3Y: 14.2, returns5Y: 16.8, minSIP: 500, minLumpsum: 5000, riskLevel: "Moderate", aum: "₹32,400 Cr", expenseRatio: 0.54 },
    { id: "MF-002", name: "Mirae Asset Large Cap", house: "Mirae Asset", category: "Equity", nav: 98.12, returns1Y: 22.1, returns3Y: 15.8, returns5Y: 18.2, minSIP: 1000, minLumpsum: 5000, riskLevel: "Moderate", aum: "₹28,900 Cr", expenseRatio: 0.48 },
    { id: "MF-003", name: "HDFC Short Term Debt", house: "HDFC MF", category: "Debt", nav: 24.67, returns1Y: 7.2, returns3Y: 6.8, returns5Y: 7.1, minSIP: 500, minLumpsum: 5000, riskLevel: "Low", aum: "₹14,200 Cr", expenseRatio: 0.28 },
    { id: "MF-004", name: "Nifty 50 Index Fund", house: "UTI MF", category: "Index", nav: 156.88, returns1Y: 26.8, returns3Y: 16.4, returns5Y: 17.9, minSIP: 500, minLumpsum: 5000, riskLevel: "Moderate", aum: "₹19,600 Cr", expenseRatio: 0.18 },
    { id: "MF-005", name: "SBI Small Cap Fund", house: "SBI MF", category: "Equity", nav: 184.22, returns1Y: 38.2, returns3Y: 24.6, returns5Y: 28.4, minSIP: 500, minLumpsum: 5000, riskLevel: "High", aum: "₹22,100 Cr", expenseRatio: 0.72 },
    { id: "MF-006", name: "ICICI Balanced Advantage", house: "ICICI Prudential", category: "Hybrid", nav: 61.45, returns1Y: 15.6, returns3Y: 12.8, returns5Y: 14.2, minSIP: 1000, minLumpsum: 5000, riskLevel: "Low", aum: "₹56,800 Cr", expenseRatio: 0.89 },
  ],

  holdings: [
    { fundId: "MF-004", units: 245.6, avgNav: 134.2, currentNav: 156.88, investedAmount: 32950, currentValue: 38534, returns: 5584, returnsPercent: 16.95, sipAmount: 2000, sipDate: 1, isSIP: true },
    { fundId: "MF-001", units: 580.2, avgNav: 43.1, currentNav: 52.34, investedAmount: 25000, currentValue: 30369, returns: 5369, returnsPercent: 21.48, isSIP: false },
    { fundId: "MF-003", units: 1200, avgNav: 22.5, currentNav: 24.67, investedAmount: 27000, currentValue: 29604, returns: 2604, returnsPercent: 9.64, sipAmount: 3000, sipDate: 15, isSIP: true },
  ],

  goldHolding: {
    grams: 4.5, avgBuyPrice: 5800, currentPrice: 6420,
    investedAmount: 26100, currentValue: 28890,
  },

  rewards: {
    points: 4280, tier: "Silver",
    history: [
      { id: "R-001", description: "UPI payment – Amazon", points: 25, type: "earned", date: "05 Jul 2024" },
      { id: "R-002", description: "Salary credit bonus", points: 500, type: "earned", date: "01 Jul 2024" },
      { id: "R-003", description: "Swiggy cashback", points: 12, type: "earned", date: "04 Jul 2024" },
      { id: "R-004", description: "Redeemed – Zomato ₹200", points: -400, type: "redeemed", date: "20 Jun 2024" },
      { id: "R-005", description: "Referral bonus – Neha Gupta", points: 1000, type: "earned", date: "15 Jun 2024" },
    ],
  },

  vouchers: [
    { id: "V-001", brand: "Amazon", description: "₹200 off on min order ₹999", pointsCost: 400, value: "₹200", category: "Shopping", emoji: "🛒" },
    { id: "V-002", brand: "Swiggy", description: "₹150 off on first 3 orders", pointsCost: 300, value: "₹150", category: "Food", emoji: "🍔" },
    { id: "V-003", brand: "BookMyShow", description: "2 movie tickets free", pointsCost: 800, value: "₹400", category: "Entertainment", emoji: "🎬" },
    { id: "V-004", brand: "Myntra", description: "₹500 off on min ₹2000", pointsCost: 1000, value: "₹500", category: "Fashion", emoji: "👗" },
    { id: "V-005", brand: "Meridian Cashback", description: "₹100 direct cashback", pointsCost: 200, value: "₹100", category: "Cashback", emoji: "💰" },
  ],

  budgets: [
    { category: "Food & Dining", limit: 8000, spent: 5340, emoji: "🍔" },
    { category: "Shopping", limit: 15000, spent: 12499, emoji: "🛒" },
    { category: "Transport", limit: 3000, spent: 1840, emoji: "🚗" },
    { category: "Utilities", limit: 5000, spent: 3840, emoji: "⚡" },
    { category: "Entertainment", limit: 2000, spent: 892, emoji: "🎬" },
    { category: "Health", limit: 3000, spent: 0, emoji: "💊" },
  ],

  payees: [
    { id: "PAY-001", name: "Neha Gupta", bank: "ICICI Bank", accountMasked: "••8871", ifsc: "ICIC0001234", upiId: "neha.gupta@icici", cooling: "verified", addedDate: "22 Feb 2023" },
    { id: "PAY-002", name: "Arjun Mehta", bank: "Axis Bank", accountMasked: "••5510", ifsc: "UTIB0000456", upiId: "arjun.mehta@axisbank", cooling: "verified", addedDate: "10 Nov 2022" },
    { id: "PAY-003", name: "Geeta Sharma", bank: "State Bank of India", accountMasked: "••9900", ifsc: "SBIN0001122", upiId: "", cooling: "verified", addedDate: "05 Jan 2020" },
    { id: "PAY-004", name: "Rahul Sharma", bank: "Meridian Bank", accountMasked: "••7711", ifsc: IFSC, upiId: "rahul.sharma@meridian", cooling: "verified", addedDate: "12 Jan 2019" },
    { id: "PAY-005", name: "Zeel Traders", bank: "Kotak Mahindra", accountMasked: "••3382", ifsc: "KKBK0000221", upiId: "", cooling: "cooling", addedDate: "05 Jul 2024" },
  ],

  notifications: [
    { id: "N-001", type: "security", title: "Was this you?", body: "Suspicious ₹24,500 transfer at 03:12 AM. Please verify.", time: "29 Jun 2024, 03:14", read: false, deepLink: "fraud" },
    { id: "N-002", type: "transaction", title: "Salary credited", body: "₹1,85,000 credited from Infosys Ltd.", time: "01 Jul 2024, 09:15", read: false },
    { id: "N-003", type: "loan", title: "Counter-offer on Personal Loan", body: "New terms: ₹6,50,000 at 11.25%. Review now.", time: "03 Jul 2024, 16:22", read: false, deepLink: "loan-counter" },
    { id: "N-004", type: "reward", title: "500 coins earned!", body: "You earned 500 reward coins on your salary credit.", time: "01 Jul 2024, 09:16", read: true },
    { id: "N-005", type: "offer", title: "Pre-approved: ₹8L Personal Loan", body: "Tap to check your offer. Limited time.", time: "02 Jul 2024, 10:00", read: true },
  ],

  tickets: [
    {
      id: "TKT-001", subject: "Dispute: Unauthorized IMPS transfer", category: "Fraud",
      status: "In Progress", createdDate: "29 Jun 2024", lastUpdate: "04 Jul 2024",
      messages: [
        { id: "M-001", from: "user", text: "I did not authorize the ₹24,500 IMPS transfer on 29 Jun 2024.", time: "29 Jun 2024, 08:00" },
        { id: "M-002", from: "support", text: "We have initiated an investigation. Your account has been partially frozen as a precaution.", time: "29 Jun 2024, 09:40" },
        { id: "M-003", from: "support", text: "We've contacted the beneficiary bank. Please submit any supporting documents.", time: "02 Jul 2024, 14:20" },
      ],
    },
  ],

  chatMessages: [
    { id: "AI-001", from: "ai", text: "Hi Priya! I'm your Meridian AI assistant. Ask me anything about your account — balances, spending, transfers, or anything else.", time: "now" },
  ],

  fraudAlerts: [
    { id: "FRD-001", txnId: "TXN-007", severity: "high", description: "Suspicious ₹24,500 IMPS transfer to an unverified beneficiary at 03:12 AM", date: "29 Jun 2024", time: "03:14", status: "Customer Notified", caseRef: "CASE-FRD-441", autoFrozen: true },
  ],

  disputes: [
    { id: "DIS-2024-00021", txnId: "TXN-007", reason: "Unauthorised transaction", amount: 24500, filedOn: "29 Jun 2024", status: "Under Investigation", expectedResolutionBy: "13 Jul 2024", updates: [
      { date: "29 Jun 2024", time: "03:15", note: "Customer denied transaction. Account partially frozen." },
      { date: "29 Jun 2024", time: "09:40", note: "Case assigned to Fraud Ops team." },
      { date: "04 Jul 2024", time: "11:00", note: "Beneficiary bank contacted for reversal." },
    ]},
  ],

  upiMandates: [
    { id: "MND-001", merchant: "Netflix Premium", amountCap: 649, frequency: "Monthly", nextDebit: "18 Jul 2024", status: "Active" },
    { id: "MND-002", merchant: "Amazon Prime", amountCap: 1499, frequency: "Yearly", nextDebit: "02 Feb 2025", status: "Active" },
    { id: "MND-003", merchant: "Cred Rent Pay", amountCap: 45000, frequency: "Monthly", nextDebit: "05 Aug 2024", status: "Active" },
    { id: "MND-004", merchant: "Zerodha SIP", amountCap: 15000, frequency: "Monthly", nextDebit: "25 Jul 2024", status: "Active" },
  ],

  collectRequests: [
    { id: "COL-001", from: "Neha Gupta", upiId: "neha.gupta@icici", amount: 620, note: "Cab share", expiresIn: "22h left", status: "Open" },
    { id: "COL-002", from: "Zeel Traders", upiId: "zeel.traders@ybl", amount: 4500, note: "Invoice #2210", expiresIn: "1d 4h left", status: "Open" },
  ],
};

// ─────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────

export type AppAction =
  // Payments
  | { type: "SEND_MONEY"; accountId: string; amount: number; description: string; counterparty: string; channel: TxnChannel }
  | { type: "PAY_BILL"; accountId: string; amount: number; description: string; biller: string }
  // Cards
  | { type: "FREEZE_CARD"; cardId: string }
  | { type: "UNFREEZE_CARD"; cardId: string }
  | { type: "TOGGLE_CARD_CONTROL"; cardId: string; control: keyof Card["controls"] }
  | { type: "UPDATE_CARD_LIMIT"; cardId: string; limitType: keyof Card["limits"]; value: number }
  // Pots
  | { type: "CREATE_POT"; pot: Omit<SavingsPot, "id" | "createdDate"> }
  | { type: "ADD_TO_POT"; potId: string; amount: number; accountId: string }
  | { type: "WITHDRAW_FROM_POT"; potId: string; amount: number; accountId: string }
  | { type: "DELETE_POT"; potId: string }
  // Deposits
  | { type: "CREATE_DEPOSIT"; deposit: Omit<Deposit, "id"> }
  // Investments
  | { type: "BUY_FUND"; fundId: string; amount: number; isSIP: boolean; sipDate?: number }
  | { type: "BUY_GOLD"; grams: number; price: number; amount: number }
  | { type: "SELL_GOLD"; grams: number; price: number }
  // Rewards
  | { type: "REDEEM_VOUCHER"; voucherId: string }
  // Budgets
  | { type: "UPDATE_BUDGET"; category: string; limit: number }
  // Notifications
  | { type: "MARK_NOTIFICATION_READ"; id: string }
  | { type: "MARK_ALL_NOTIFICATIONS_READ" }
  // Support
  | { type: "CREATE_TICKET"; subject: string; category: string; message: string }
  | { type: "REPLY_TICKET"; ticketId: string; text: string }
  // AI Chat
  | { type: "SEND_AI_MESSAGE"; text: string }
  | { type: "RECEIVE_AI_RESPONSE"; text: string }
  // UPI
  | { type: "TOGGLE_MANDATE"; mandateId: string }
  | { type: "DECLINE_COLLECT"; requestId: string }
  | { type: "PAY_COLLECT"; requestId: string; accountId: string };

// ─────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────

let txnCounter = 100;
let ticketCounter = 10;
let chatCounter = 10;

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
}

function addTransaction(state: AppState, txn: Omit<Transaction, "id">): Transaction {
  return { ...txn, id: `TXN-${++txnCounter}` };
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {

    case "SEND_MONEY": {
      const acc = state.accounts.find(a => a.id === action.accountId)!;
      const newTxn = addTransaction(state, {
        accountId: action.accountId, type: "debit", category: "upi",
        description: action.description, counterparty: action.counterparty,
        amount: action.amount, runningBalance: acc.balance - action.amount,
        date: "Today", time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        status: "Completed", channel: action.channel, reference: `UPI/${Date.now()}`,
        notes: "", fraudFlag: false,
      });
      return {
        ...state,
        accounts: state.accounts.map(a =>
          a.id === action.accountId
            ? { ...a, balance: a.balance - action.amount, availableBalance: a.availableBalance - action.amount }
            : a
        ),
        transactions: [newTxn, ...state.transactions],
      };
    }

    case "PAY_BILL": {
      const acc = state.accounts.find(a => a.id === action.accountId)!;
      const newTxn = addTransaction(state, {
        accountId: action.accountId, type: "debit", category: "upi",
        description: action.description, counterparty: action.biller,
        amount: action.amount, runningBalance: acc.balance - action.amount,
        date: "Today", time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        status: "Completed", channel: "UPI", reference: `BILL/${Date.now()}`,
        notes: "", fraudFlag: false,
      });
      return {
        ...state,
        accounts: state.accounts.map(a =>
          a.id === action.accountId
            ? { ...a, balance: a.balance - action.amount, availableBalance: a.availableBalance - action.amount }
            : a
        ),
        transactions: [newTxn, ...state.transactions],
        budgets: state.budgets.map(b =>
          b.category === "Utilities" ? { ...b, spent: b.spent + action.amount } : b
        ),
      };
    }

    case "FREEZE_CARD":
      return { ...state, cards: state.cards.map(c => c.id === action.cardId ? { ...c, frozen: true } : c) };

    case "UNFREEZE_CARD":
      return { ...state, cards: state.cards.map(c => c.id === action.cardId ? { ...c, frozen: false } : c) };

    case "TOGGLE_CARD_CONTROL":
      return { ...state, cards: state.cards.map(c => c.id === action.cardId ? { ...c, controls: { ...c.controls, [action.control]: !c.controls[action.control] } } : c) };

    case "UPDATE_CARD_LIMIT":
      return { ...state, cards: state.cards.map(c => c.id === action.cardId ? { ...c, limits: { ...c.limits, [action.limitType]: action.value } } : c) };

    case "CREATE_POT":
      return { ...state, pots: [...state.pots, { ...action.pot, id: makeId("POT"), createdDate: "Today" }] };

    case "ADD_TO_POT": {
      return {
        ...state,
        pots: state.pots.map(p => p.id === action.potId ? { ...p, currentAmount: p.currentAmount + action.amount } : p),
        accounts: state.accounts.map(a => a.id === action.accountId ? { ...a, balance: a.balance - action.amount, availableBalance: a.availableBalance - action.amount } : a),
      };
    }

    case "WITHDRAW_FROM_POT": {
      return {
        ...state,
        pots: state.pots.map(p => p.id === action.potId ? { ...p, currentAmount: p.currentAmount - action.amount } : p),
        accounts: state.accounts.map(a => a.id === action.accountId ? { ...a, balance: a.balance + action.amount, availableBalance: a.availableBalance + action.amount } : a),
      };
    }

    case "DELETE_POT":
      return { ...state, pots: state.pots.filter(p => p.id !== action.potId) };

    case "CREATE_DEPOSIT":
      return { ...state, deposits: [...state.deposits, { ...action.deposit, id: makeId("DEP") }] };

    case "BUY_FUND": {
      const fund = state.mutualFunds.find(f => f.id === action.fundId)!;
      const existing = state.holdings.find(h => h.fundId === action.fundId);
      const units = action.amount / fund.nav;
      if (existing) {
        return {
          ...state,
          holdings: state.holdings.map(h => h.fundId === action.fundId ? {
            ...h, units: h.units + units,
            investedAmount: h.investedAmount + action.amount,
            currentValue: (h.units + units) * fund.nav,
            isSIP: action.isSIP || h.isSIP,
            sipAmount: action.isSIP ? action.amount : h.sipAmount,
            sipDate: action.sipDate ?? h.sipDate,
          } : h),
        };
      }
      return {
        ...state,
        holdings: [...state.holdings, {
          fundId: action.fundId, units, avgNav: fund.nav, currentNav: fund.nav,
          investedAmount: action.amount, currentValue: action.amount,
          returns: 0, returnsPercent: 0,
          isSIP: action.isSIP, sipAmount: action.isSIP ? action.amount : undefined, sipDate: action.sipDate,
        }],
      };
    }

    case "BUY_GOLD": {
      const g = state.goldHolding;
      const newGrams = g.grams + action.grams;
      const newInvested = g.investedAmount + action.amount;
      return { ...state, goldHolding: { ...g, grams: newGrams, investedAmount: newInvested, currentValue: newGrams * action.price, currentPrice: action.price, avgBuyPrice: newInvested / newGrams } };
    }

    case "SELL_GOLD": {
      const g = state.goldHolding;
      const newGrams = g.grams - action.grams;
      return { ...state, goldHolding: { ...g, grams: newGrams, investedAmount: (g.investedAmount / g.grams) * newGrams, currentValue: newGrams * action.price } };
    }

    case "REDEEM_VOUCHER": {
      const v = state.vouchers.find(v => v.id === action.voucherId)!;
      return {
        ...state,
        rewards: {
          ...state.rewards,
          points: state.rewards.points - v.pointsCost,
          history: [{ id: makeId("R"), description: `Redeemed – ${v.brand} ${v.value}`, points: -v.pointsCost, type: "redeemed", date: "Today" }, ...state.rewards.history],
        },
      };
    }

    case "UPDATE_BUDGET":
      return { ...state, budgets: state.budgets.map(b => b.category === action.category ? { ...b, limit: action.limit } : b) };

    case "MARK_NOTIFICATION_READ":
      return { ...state, notifications: state.notifications.map(n => n.id === action.id ? { ...n, read: true } : n) };

    case "MARK_ALL_NOTIFICATIONS_READ":
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };

    case "CREATE_TICKET": {
      const ticket: SupportTicket = {
        id: `TKT-${++ticketCounter}`, subject: action.subject, category: action.category,
        status: "Open", createdDate: "Today", lastUpdate: "Today",
        messages: [{ id: `M-${Date.now()}`, from: "user", text: action.message, time: "Just now" }],
      };
      return { ...state, tickets: [ticket, ...state.tickets] };
    }

    case "REPLY_TICKET":
      return {
        ...state,
        tickets: state.tickets.map(t => t.id === action.ticketId ? {
          ...t, lastUpdate: "Just now",
          messages: [...t.messages, { id: `M-${Date.now()}`, from: "user", text: action.text, time: "Just now" }],
        } : t),
      };

    case "SEND_AI_MESSAGE":
      return { ...state, chatMessages: [...state.chatMessages, { id: makeId("AI"), from: "user", text: action.text, time: "Just now" }] };

    case "RECEIVE_AI_RESPONSE":
      return { ...state, chatMessages: [...state.chatMessages, { id: makeId("AI"), from: "ai", text: action.text, time: "Just now" }] };

    case "TOGGLE_MANDATE":
      return { ...state, upiMandates: state.upiMandates.map(m => m.id === action.mandateId ? { ...m, status: m.status === "Active" ? "Paused" : "Active" } : m) };

    case "DECLINE_COLLECT":
      return { ...state, collectRequests: state.collectRequests.map(r => r.id === action.requestId ? { ...r, status: "Declined" } : r) };

    case "PAY_COLLECT": {
      const req = state.collectRequests.find(r => r.id === action.requestId)!;
      return {
        ...state,
        collectRequests: state.collectRequests.map(r => r.id === action.requestId ? { ...r, status: "Paid" } : r),
        accounts: state.accounts.map(a => a.id === action.accountId ? { ...a, balance: a.balance - req.amount, availableBalance: a.availableBalance - req.amount } : a),
      };
    }

    default:
      return state;
  }
}

// ─────────────────────────────────────────────
// CONTEXT + HOOKS
// ─────────────────────────────────────────────

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<AppAction> } | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx.state;
}

export function useAppDispatch() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppDispatch must be used within AppProvider");
  return ctx.dispatch;
}

export function useAccount(id: string) {
  const { accounts } = useAppState();
  return accounts.find(a => a.id === id) ?? accounts[0];
}
