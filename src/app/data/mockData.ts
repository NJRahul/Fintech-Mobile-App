// =========================================================
// Meridian Bank — Mock Data (single source of truth)
// All monetary values in INR, dates in DD MMM YYYY, HH:mm
// =========================================================

export const BANK = {
  name: "Meridian Bank",
  tagline: "Enterprise Banking",
  ifsc: "MERD0000123",
  branch: "Meridian Bank – Bandra Kurla Complex, Mumbai",
  upiHandle: "meridian",
};

export const CUSTOMER = {
  id: "CUS-2024-08847",
  name: "Priya Sharma",
  mobile: "+91 98765 43210",
  email: "priya.sharma@example.com",
  dob: "15 Mar 1990",
  panMasked: "AXXXX1234K",
  address: "B-402, Skyline Residency, Bandra West, Mumbai – 400050",
  kycStatus: "approved" as const,
  kycTier: "Full KYC" as const,
  riskTier: "Standard",
  creditScore: 748,
  creditScoreCategory: "Good",
  branch: BANK.branch,
  nominee: "Rahul Sharma (Spouse)",
  primaryUpiId: "priya.sharma@meridian",
};

// ---------- Accounts ----------
export type AccountStatus = "Active" | "Frozen" | "Dormant" | "Closed";
export type AccountType = "Savings" | "Current" | "Salary" | "NRE";

export const ACCOUNTS = [
  {
    id: "ACC-SVG-001",
    type: "Savings" as AccountType,
    nickname: "Everyday Savings",
    accountNumberMasked: "••4821",
    accountNumberFull: "5081 2379 4821",
    ifsc: BANK.ifsc,
    balance: 384520.75,
    availableBalance: 382520.75,
    holdAmount: 2000,
    currency: "INR",
    status: "Active" as AccountStatus,
    openedDate: "12 Jan 2019",
    interestRate: 3.5,
    dailyTransferLimit: 500000,
    dailyWithdrawalLimit: 100000,
  },
  {
    id: "ACC-CUR-002",
    type: "Current" as AccountType,
    nickname: "Business – Sharma Consulting",
    accountNumberMasked: "••0092",
    accountNumberFull: "5081 4489 0092",
    ifsc: BANK.ifsc,
    balance: 128450.0,
    availableBalance: 128450.0,
    holdAmount: 0,
    currency: "INR",
    status: "Active" as AccountStatus,
    openedDate: "05 Aug 2021",
    interestRate: 0,
    dailyTransferLimit: 2000000,
    dailyWithdrawalLimit: 200000,
  },
];

// ---------- Transactions ----------
export type TxnStatus = "Processing" | "Completed" | "Failed" | "Flagged" | "Disputed" | "Reversed";
export type TxnType = "credit" | "debit";
export type TxnChannel = "UPI" | "NEFT" | "IMPS" | "RTGS" | "Card" | "ATM" | "Wallet" | "SWIFT" | "NACH";

export const TRANSACTIONS: {
  id: string;
  type: TxnType;
  channelCategory: "transfer" | "card" | "upi" | "emi" | "wallet" | "cash";
  description: string;
  counterparty: string;
  category: string;
  amount: number;
  runningBalance: number;
  date: string;
  time: string;
  status: TxnStatus;
  channel: TxnChannel;
  reference: string;
  accountId: string;
  notes: string;
  fraudFlag: boolean;
  disputeId?: string;
}[] = [
  {
    id: "TXN-2024-00892",
    type: "debit",
    channelCategory: "upi",
    description: "Amazon India",
    counterparty: "Amazon Seller Services Pvt Ltd",
    category: "Shopping",
    amount: 2499.0,
    runningBalance: 384520.75,
    date: "05 Jul 2024",
    time: "14:32",
    status: "Completed",
    channel: "UPI",
    reference: "UPI/424932100181/Amazon",
    accountId: "ACC-SVG-001",
    notes: "",
    fraudFlag: false,
  },
  {
    id: "TXN-2024-00891",
    type: "credit",
    channelCategory: "transfer",
    description: "Salary – Infosys Ltd",
    counterparty: "Infosys Limited",
    category: "Income",
    amount: 185000.0,
    runningBalance: 387019.75,
    date: "01 Jul 2024",
    time: "09:15",
    status: "Completed",
    channel: "NEFT",
    reference: "NEFT/N241830/INFOSY",
    accountId: "ACC-SVG-001",
    notes: "July 2024 Salary",
    fraudFlag: false,
  },
  {
    id: "TXN-2024-00890",
    type: "debit",
    channelCategory: "upi",
    description: "Swiggy",
    counterparty: "Swiggy Bundl Technologies",
    category: "Food & Dining",
    amount: 648.0,
    runningBalance: 202019.75,
    date: "04 Jul 2024",
    time: "20:10",
    status: "Completed",
    channel: "UPI",
    reference: "UPI/424720081122/Swiggy",
    accountId: "ACC-SVG-001",
    notes: "",
    fraudFlag: false,
  },
  {
    id: "TXN-2024-00889",
    type: "debit",
    channelCategory: "emi",
    description: "EMI – Home Loan LN-004421",
    counterparty: "Meridian Bank Loans",
    category: "Loan EMI",
    amount: 30714.0,
    runningBalance: 202667.75,
    date: "10 Jul 2024",
    time: "11:00",
    status: "Processing",
    channel: "NACH",
    reference: "NACH/EMI/LN-004421/07",
    accountId: "ACC-SVG-001",
    notes: "Auto-debit mandate",
    fraudFlag: false,
  },
  {
    id: "TXN-2024-00888",
    type: "debit",
    channelCategory: "transfer",
    description: "Wire to John Smith",
    counterparty: "John Smith – JPMorgan Chase, NY",
    category: "Transfer – Cross-border",
    amount: 41250.0,
    runningBalance: 233381.75,
    date: "02 Jul 2024",
    time: "16:45",
    status: "Processing",
    channel: "SWIFT",
    reference: "SWIFT/MT103/241830982",
    accountId: "ACC-SVG-001",
    notes: "Freelance payment USD 500",
    fraudFlag: false,
  },
  {
    id: "TXN-2024-00887",
    type: "debit",
    channelCategory: "cash",
    description: "ATM Withdrawal",
    counterparty: "Meridian ATM – Linking Road",
    category: "Cash",
    amount: 10000.0,
    runningBalance: 274631.75,
    date: "30 Jun 2024",
    time: "18:22",
    status: "Completed",
    channel: "ATM",
    reference: "ATM/667443/BNDR",
    accountId: "ACC-SVG-001",
    notes: "",
    fraudFlag: false,
  },
  {
    id: "TXN-2024-00886",
    type: "debit",
    channelCategory: "transfer",
    description: "Transfer to Unknown Beneficiary",
    counterparty: "Unverified merchant",
    category: "Transfer",
    amount: 24500.0,
    runningBalance: 284631.75,
    date: "29 Jun 2024",
    time: "03:12",
    status: "Flagged",
    channel: "IMPS",
    reference: "IMPS/334455812/UNK",
    accountId: "ACC-SVG-001",
    notes: "Flagged by fraud rule 12 (unusual time + new payee)",
    fraudFlag: true,
    disputeId: "DIS-2024-00021",
  },
  {
    id: "TXN-2024-00885",
    type: "credit",
    channelCategory: "transfer",
    description: "Freelance – Upwork",
    counterparty: "Upwork Escrow Inc.",
    category: "Income",
    amount: 42800.0,
    runningBalance: 309131.75,
    date: "28 Jun 2024",
    time: "12:30",
    status: "Completed",
    channel: "NEFT",
    reference: "NEFT/N241790/UPWORK",
    accountId: "ACC-SVG-001",
    notes: "June project",
    fraudFlag: false,
  },
  {
    id: "TXN-2024-00884",
    type: "debit",
    channelCategory: "upi",
    description: "BEST Electricity",
    counterparty: "BEST Undertaking",
    category: "Utilities",
    amount: 3840.0,
    runningBalance: 266331.75,
    date: "27 Jun 2024",
    time: "10:00",
    status: "Completed",
    channel: "UPI",
    reference: "UPI/424690112233/BEST",
    accountId: "ACC-SVG-001",
    notes: "",
    fraudFlag: false,
  },
  {
    id: "TXN-2024-00883",
    type: "debit",
    channelCategory: "transfer",
    description: "SIP – Axis Bluechip Fund",
    counterparty: "Axis MF Zerodha Fund House",
    category: "Investment",
    amount: 15000.0,
    runningBalance: 270171.75,
    date: "25 Jun 2024",
    time: "09:00",
    status: "Failed",
    channel: "NACH",
    reference: "NACH/SIP/AXIS/06",
    accountId: "ACC-SVG-001",
    notes: "Insufficient balance at mandate time",
    fraudFlag: false,
  },
  {
    id: "TXN-2024-00882",
    type: "debit",
    channelCategory: "card",
    description: "Zomato",
    counterparty: "Zomato Ltd",
    category: "Food & Dining",
    amount: 892.0,
    runningBalance: 285171.75,
    date: "24 Jun 2024",
    time: "21:44",
    status: "Completed",
    channel: "Card",
    reference: "POS/ZOMATO/241760",
    accountId: "ACC-SVG-001",
    notes: "",
    fraudFlag: false,
  },
  {
    id: "TXN-2024-00881",
    type: "debit",
    channelCategory: "wallet",
    description: "Wallet Top-up",
    counterparty: "Meridian Wallet",
    category: "Wallet",
    amount: 2000.0,
    runningBalance: 286063.75,
    date: "24 Jun 2024",
    time: "08:12",
    status: "Completed",
    channel: "Wallet",
    reference: "WLT/TOPUP/889221",
    accountId: "ACC-SVG-001",
    notes: "",
    fraudFlag: false,
  },
];

// ---------- Beneficiaries / Payees ----------
export type PayeeCoolingStatus = "verified" | "cooling" | "unverified";

export const PAYEES = [
  { id: "PAY-001", name: "Neha Gupta", bank: "ICICI Bank", accountMasked: "••8871", ifsc: "ICIC0001234", upiId: "neha.gupta@icici", cooling: "verified" as PayeeCoolingStatus, addedDate: "22 Feb 2023" },
  { id: "PAY-002", name: "Arjun Mehta", bank: "Axis Bank", accountMasked: "••5510", ifsc: "UTIB0000456", upiId: "arjun.mehta@axisbank", cooling: "verified" as PayeeCoolingStatus, addedDate: "10 Nov 2022" },
  { id: "PAY-003", name: "Geeta Sharma (Mom)", bank: "State Bank of India", accountMasked: "••9900", ifsc: "SBIN0001122", upiId: "", cooling: "verified" as PayeeCoolingStatus, addedDate: "05 Jan 2020" },
  { id: "PAY-004", name: "Rahul Sharma", bank: "Meridian Bank", accountMasked: "••7711", ifsc: BANK.ifsc, upiId: "rahul.sharma@meridian", cooling: "verified" as PayeeCoolingStatus, addedDate: "12 Jan 2019" },
  { id: "PAY-005", name: "Zeel Traders", bank: "Kotak Mahindra", accountMasked: "••3382", ifsc: "KKBK0000221", upiId: "", cooling: "cooling" as PayeeCoolingStatus, addedDate: "05 Jul 2024" },
];

// ---------- Loans ----------
export type LoanStatus = "Active" | "Submitted" | "In Review" | "Credit Assessment" | "Counter-Offer" | "Approved" | "Rejected" | "Disbursed" | "Closed";

export const LOANS = [
  {
    id: "LN-2023-004421",
    type: "Home Loan",
    principalAmount: 4500000,
    outstandingAmount: 3874500,
    disbursedDate: "15 Mar 2023",
    tenureMonths: 240,
    remainingMonths: 202,
    interestRate: 8.5,
    emiAmount: 30714,
    emiDueDay: 10,
    status: "Active" as LoanStatus,
    nextEmiDate: "10 Aug 2024",
    totalPaid: 625500,
    autoDebitEnabled: true,
    mandateType: "UPI Autopay",
  },
  {
    id: "LN-2022-001122",
    type: "Personal Loan",
    principalAmount: 250000,
    outstandingAmount: 0,
    disbursedDate: "20 Jan 2022",
    tenureMonths: 24,
    remainingMonths: 0,
    interestRate: 12.5,
    emiAmount: 11800,
    emiDueDay: 20,
    status: "Closed" as LoanStatus,
    nextEmiDate: "",
    totalPaid: 283200,
    autoDebitEnabled: false,
    mandateType: "",
  },
];

export const EMI_SCHEDULE = [
  { month: "Apr 2024", due: "10 Apr 2024", principal: 9020, interest: 21694, total: 30714, status: "Paid" as const },
  { month: "May 2024", due: "10 May 2024", principal: 9085, interest: 21629, total: 30714, status: "Paid" as const },
  { month: "Jun 2024", due: "10 Jun 2024", principal: 9150, interest: 21564, total: 30714, status: "Paid" as const },
  { month: "Jul 2024", due: "10 Jul 2024", principal: 9214, interest: 21500, total: 30714, status: "Paid" as const },
  { month: "Aug 2024", due: "10 Aug 2024", principal: 9279, interest: 21435, total: 30714, status: "Upcoming" as const },
  { month: "Sep 2024", due: "10 Sep 2024", principal: 9345, interest: 21369, total: 30714, status: "Upcoming" as const },
  { month: "Oct 2024", due: "10 Oct 2024", principal: 9411, interest: 21303, total: 30714, status: "Upcoming" as const },
];

export const LOAN_PRODUCTS = [
  { id: "PROD-PL", type: "Personal Loan", iconKey: "user", maxAmount: 2000000, interestFrom: 10.5, maxTenureMonths: 60, description: "Quick approval, minimal documentation", eligibleAmount: 800000, preApproved: true },
  { id: "PROD-HL", type: "Home Loan", iconKey: "home", maxAmount: 15000000, interestFrom: 8.4, maxTenureMonths: 300, description: "Low rates, long tenure, tax benefits", eligibleAmount: 6500000, preApproved: false },
  { id: "PROD-AL", type: "Auto Loan", iconKey: "car", maxAmount: 3000000, interestFrom: 9.0, maxTenureMonths: 84, description: "Finance your dream vehicle", eligibleAmount: 1500000, preApproved: false },
  { id: "PROD-BL", type: "Business Loan", iconKey: "briefcase", maxAmount: 7500000, interestFrom: 11.0, maxTenureMonths: 84, description: "Grow your business with flexible terms", eligibleAmount: 3500000, preApproved: false },
];

// Counter-offer example (loan application in progress)
export const LOAN_APPLICATION = {
  id: "APP-2024-00781",
  productType: "Personal Loan",
  requested: { amount: 800000, tenureMonths: 48, rate: 10.5, emi: 20472 },
  offered:   { amount: 650000, tenureMonths: 48, rate: 11.25, emi: 16878 },
  status: "Counter-Offer" as LoanStatus,
  reason: "Approved for a lower amount at revised rate based on debt-to-income ratio.",
  submittedOn: "03 Jul 2024",
};

// ---------- Cards ----------
export type CardType = "Debit" | "Credit";
export type CardNetwork = "Visa" | "Mastercard" | "RuPay";

export const CARDS = [
  {
    id: "CARD-001",
    type: "Debit" as CardType,
    network: "Visa" as CardNetwork,
    numberMasked: "•••• •••• •••• 4821",
    holder: "PRIYA SHARMA",
    expiry: "08 / 27",
    linkedAccountId: "ACC-SVG-001",
    frozen: false,
    limits: { online: 50000, contactless: 5000, atm: 50000, international: 25000 },
    controls: { online: true, contactless: true, atm: true, international: false },
    color: "#0E1B33",
  },
  {
    id: "CARD-002",
    type: "Credit" as CardType,
    network: "Mastercard" as CardNetwork,
    numberMasked: "•••• •••• •••• 6612",
    holder: "PRIYA SHARMA",
    expiry: "11 / 26",
    linkedAccountId: "ACC-SVG-001",
    frozen: false,
    creditLimit: 300000,
    availableCredit: 218450,
    dueDate: "15 Jul 2024",
    minDue: 8420,
    totalDue: 81550,
    limits: { online: 100000, contactless: 5000, atm: 20000, international: 100000 },
    controls: { online: true, contactless: true, atm: true, international: true },
    color: "#1B4DD8",
  },
];

// ---------- Wallet ----------
export const WALLET = {
  balance: 3840.0,
  tier: "Full KYC" as const,
  monthlyLimit: 100000,
  usedThisMonth: 14260,
  upiId: CUSTOMER.primaryUpiId,
  linkedAccountId: "ACC-SVG-001",
  transactions: [
    { id: "WT-005", type: "credit" as TxnType, description: "Top-up from Savings ••4821", amount: 2000, date: "04 Jul 2024", status: "Completed" as const, channel: "Wallet" as TxnChannel },
    { id: "WT-004", type: "debit" as TxnType, description: "Neha Gupta – Dinner split", amount: 500, date: "03 Jul 2024", status: "Completed" as const, channel: "Wallet" as TxnChannel },
    { id: "WT-003", type: "debit" as TxnType, description: "Ola Cabs", amount: 320, date: "02 Jul 2024", status: "Completed" as const, channel: "Wallet" as TxnChannel },
    { id: "WT-002", type: "credit" as TxnType, description: "Arjun Mehta – Movie", amount: 1500, date: "01 Jul 2024", status: "Completed" as const, channel: "Wallet" as TxnChannel },
    { id: "WT-001", type: "debit" as TxnType, description: "BookMyShow", amount: 840, date: "30 Jun 2024", status: "Completed" as const, channel: "Wallet" as TxnChannel },
  ],
};

// ---------- UPI Mandates ----------
export const UPI_MANDATES = [
  { id: "MND-001", merchant: "Netflix Premium", amountCap: 649, frequency: "Monthly", nextDebit: "18 Jul 2024", status: "Active" as const },
  { id: "MND-002", merchant: "Amazon Prime", amountCap: 1499, frequency: "Yearly", nextDebit: "02 Feb 2025", status: "Active" as const },
  { id: "MND-003", merchant: "Cred Rent Pay", amountCap: 45000, frequency: "Monthly", nextDebit: "05 Aug 2024", status: "Active" as const },
  { id: "MND-004", merchant: "Zerodha SIP", amountCap: 15000, frequency: "Monthly", nextDebit: "25 Jul 2024", status: "Active" as const },
];

// ---------- Collect requests ----------
export const COLLECT_REQUESTS = [
  { id: "COL-001", from: "Neha Gupta", upiId: "neha.gupta@icici", amount: 620, note: "Cab share", expiresIn: "22h left", status: "Open" as const },
  { id: "COL-002", from: "Zeel Traders", upiId: "zeel.traders@ybl", amount: 4500, note: "Invoice #2210", expiresIn: "1d 4h left", status: "Open" as const },
];

// ---------- Fraud alerts & disputes ----------
export const FRAUD_ALERTS = [
  {
    id: "FRD-2024-00441",
    txnId: "TXN-2024-00886",
    severity: "high" as const,
    ruleTriggered: "Unusual time + new beneficiary + high value",
    description: "Suspicious ₹24,500 IMPS transfer to an unverified beneficiary at 03:12 AM",
    date: "29 Jun 2024",
    time: "03:14",
    status: "Customer Notified" as const,
    caseRef: "CASE-FRD-441",
    autoFrozen: true,
  },
];

export const DISPUTES = [
  {
    id: "DIS-2024-00021",
    txnId: "TXN-2024-00886",
    reason: "Unauthorised transaction",
    amount: 24500,
    filedOn: "29 Jun 2024",
    status: "Under Investigation" as const,
    expectedResolutionBy: "13 Jul 2024",
    assignedTo: "Fraud Ops – Case #441",
    updates: [
      { date: "29 Jun 2024", time: "03:15", note: "Customer denied transaction. Account partially frozen." },
      { date: "29 Jun 2024", time: "09:40", note: "Case assigned to Fraud Ops team." },
      { date: "02 Jul 2024", time: "14:20", note: "Requested additional evidence from customer." },
      { date: "04 Jul 2024", time: "11:00", note: "Beneficiary bank contacted for reversal." },
    ],
  },
];

// ---------- Notifications ----------
export type NotifType = "transaction" | "security" | "loan" | "kyc" | "offer";

export const NOTIFICATIONS: {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  deepLink?: string;
}[] = [
  { id: "N-001", type: "security", title: "Was this you?", body: "Suspicious ₹24,500 transfer at 03:12 AM. Please verify.", time: "29 Jun 2024, 03:14", read: false, deepLink: "fraud" },
  { id: "N-002", type: "transaction", title: "Salary credited", body: "₹1,85,000.00 credited from Infosys Ltd to Savings ••4821. Balance ₹3,87,019.75.", time: "01 Jul 2024, 09:15", read: false },
  { id: "N-003", type: "loan", title: "Counter-offer on your Personal Loan", body: "New terms: ₹6,50,000 at 11.25%. Review and respond.", time: "03 Jul 2024, 16:22", read: false, deepLink: "loan-counter" },
  { id: "N-004", type: "kyc", title: "KYC updated", body: "Your Full-KYC status has been renewed for the next 24 months.", time: "12 Jun 2024, 10:00", read: true },
  { id: "N-005", type: "transaction", title: "Card txn – Zomato", body: "₹892.00 spent on Debit Card ••4821.", time: "24 Jun 2024, 21:44", read: true },
  { id: "N-006", type: "loan", title: "EMI due in 3 days", body: "₹30,714.00 auto-debit on 10 Aug 2024 for Home Loan LN-004421.", time: "07 Aug 2024, 09:00", read: true },
];

// ---------- Devices ----------
export const DEVICES = [
  { id: "DEV-001", name: "iPhone 15 Pro", os: "iOS 17.5.1", lastActive: "Active now", location: "Mumbai, MH", current: true },
  { id: "DEV-002", name: "MacBook Pro 14", os: "macOS 14.5 · Safari 17.5", lastActive: "2 days ago", location: "Mumbai, MH", current: false },
  { id: "DEV-003", name: "Pixel 7", os: "Android 14", lastActive: "12 days ago", location: "Bengaluru, KA", current: false },
];

// ---------- Credit score history ----------
export const CREDIT_SCORE_HISTORY = [
  { month: "Aug '23", score: 712 },
  { month: "Sep '23", score: 716 },
  { month: "Oct '23", score: 720 },
  { month: "Nov '23", score: 725 },
  { month: "Dec '23", score: 728 },
  { month: "Jan '24", score: 730 },
  { month: "Feb '24", score: 734 },
  { month: "Mar '24", score: 738 },
  { month: "Apr '24", score: 741 },
  { month: "May '24", score: 744 },
  { month: "Jun '24", score: 748 },
  { month: "Jul '24", score: 748 },
];

// ---------- Corridors (cross-border) ----------
export const CORRIDORS = [
  { id: "USD-USA",  currency: "USD", country: "United States", flag: "🇺🇸", rail: "SWIFT", fx: 83.42, feeFlat: 500 },
  { id: "GBP-GBR",  currency: "GBP", country: "United Kingdom", flag: "🇬🇧", rail: "SWIFT", fx: 106.10, feeFlat: 500 },
  { id: "EUR-EUZ",  currency: "EUR", country: "Eurozone", flag: "🇪🇺", rail: "SEPA", fx: 89.75, feeFlat: 250 },
  { id: "AED-UAE",  currency: "AED", country: "United Arab Emirates", flag: "🇦🇪", rail: "SWIFT", fx: 22.71, feeFlat: 500 },
  { id: "SGD-SGP",  currency: "SGD", country: "Singapore", flag: "🇸🇬", rail: "SWIFT", fx: 62.05, feeFlat: 500 },
];
