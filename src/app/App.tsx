import { useState, useCallback, lazy, Suspense } from "react";
import { BottomNav } from "./components/BottomNav";
import type { NavTab } from "./components/BottomNav";
import { C, font } from "./theme";

// ── Module 1: Onboarding & KYC
import { SplashScreen }       from "./components/SplashScreen";
import { LoginScreen }        from "./components/LoginScreen";
import { OTPScreen }          from "./components/OTPScreen";
import { KYCDetailsScreen }   from "./components/KYCDetailsScreen";
import { VideoKYCScreen }     from "./components/VideoKYCScreen";
import { AccountTierScreen }  from "./components/AccountTierScreen";
import { BiometricSetupScreen } from "./components/BiometricSetupScreen";

// ── Module 2: Dashboard
import { Dashboard } from "./components/Dashboard";

// ── Module 3: Accounts
import { AccountDetailScreen }    from "./components/AccountDetailScreen";
import { TransactionDetailScreen } from "./components/TransactionDetailScreen";
import { StatementScreen }        from "./components/StatementScreen";

// ── Module 4: Payments
import { SendMoneyScreen }    from "./components/SendMoneyScreen";
import { BillPayScreen }      from "./components/BillPayScreen";
import { SplitBillScreen }    from "./components/SplitBillScreen";
import { TxnStatusScreen }    from "./components/TxnStatusScreen";

// ── Module 5: Cards
import { CardsScreen }        from "./components/CardsScreen";
import { CardDetailScreen }   from "./components/CardDetailScreen";
import { ApplyCardScreen }    from "./components/ApplyCardScreen";

// ── Module 6: Savings Pots
import { PotsScreen }         from "./components/PotsScreen";
import { CreatePotScreen }    from "./components/CreatePotScreen";
import { PotDetailScreen }    from "./components/PotDetailScreen";

// ── Module 7: Deposits
import { DepositsScreen }     from "./components/DepositsScreen";
import { CreateDepositScreen } from "./components/CreateDepositScreen";
import { DepositDetailScreen } from "./components/DepositDetailScreen";

// ── Module 8: Lending
import { LoansScreen }        from "./components/LoansScreen";
import { LoanDetailScreen }   from "./components/LoanDetailScreen";
import { LoanApplyScreen }    from "./components/LoanApplyScreen";

// ── Module 9: Investments
import { PortfolioScreen }    from "./components/PortfolioScreen";
import { MutualFundsScreen }  from "./components/MutualFundsScreen";
import { FundDetailScreen }   from "./components/FundDetailScreen";
import { SIPSetupScreen }     from "./components/SIPSetupScreen";
import { DigitalGoldScreen }  from "./components/DigitalGoldScreen";

// ── Module 10: Rewards
import { RewardsScreen }      from "./components/RewardsScreen";
import { RedemptionScreen }   from "./components/RedemptionScreen";
import { ReferralScreen }     from "./components/ReferralScreen";

// ── Module 11: Spend Intelligence
import { SpendScreen }        from "./components/SpendScreen";
import { BudgetScreen }       from "./components/BudgetScreen";

// ── Module 12: AI Assistant
import { AIScreen }           from "./components/AIScreen";

// ── Module 13: Security & Profile
import { ProfileScreen }      from "./components/ProfileScreen";
import { SecurityScreen }     from "./components/SecurityScreen";
import { NotificationsScreen } from "./components/NotificationsScreen";
import { PINScreen }          from "./components/PINScreen";

// ── Module 14: Support
import { SupportScreen }      from "./components/SupportScreen";
import { FAQScreen }          from "./components/FAQScreen";
import { TicketScreen }       from "./components/TicketScreen";

// ── Legacy screens (UPI / Wallet / Fraud)
import { UPIScreen }          from "./components/UPIScreen";
import { FraudScreen }        from "./components/FraudScreen";
import { DisputeFormScreen }  from "./components/DisputeFormScreen";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type Screen =
  // Onboarding
  | "splash" | "login" | "otp" | "kyc-details" | "kyc-video" | "account-tier" | "biometric-setup"
  // Home
  | "dashboard"
  // Accounts
  | "account-detail" | "txn-detail" | "statement"
  // Payments
  | "send-money" | "bill-pay" | "split-bill" | "txn-status"
  // Cards
  | "cards" | "card-detail" | "apply-card"
  // Pots
  | "pots" | "create-pot" | "pot-detail"
  // Deposits
  | "deposits" | "create-deposit" | "deposit-detail"
  // Loans
  | "loans" | "loan-detail" | "loan-apply"
  // Investments
  | "portfolio" | "mutual-funds" | "fund-detail" | "sip-setup" | "digital-gold"
  // Rewards
  | "rewards" | "redemption" | "referral"
  // Spend
  | "spend" | "budget"
  // AI
  | "ai"
  // Profile / Security
  | "profile" | "security" | "notifications" | "pin"
  // Support
  | "support" | "faq" | "ticket"
  // Legacy
  | "upi" | "upi-scan" | "fraud" | "dispute-form";

interface NavState {
  screen: Screen;
  tab: NavTab;
  // params
  accountId: string;
  txnId: string;
  cardId: string;
  potId: string;
  depositId: string;
  loanId: string;
  fundId: string;
  ticketId: string;
  isNewUser: boolean;
  txnStatusType?: "success" | "failed" | "processing";
  prevScreen?: Screen;
}

// ─────────────────────────────────────────────
// LOADING FALLBACK
// ─────────────────────────────────────────────

function Loading() {
  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, borderRadius: 999, border: `2px solid ${C.border}`, borderTop: `2px solid ${C.textSub}`, animation: "spin 0.8s linear infinite" }} />
    </div>
  );
}

const TAB_SCREENS: Record<NavTab, Screen> = {
  home: "dashboard",
  payments: "send-money",
  cards: "cards",
  invest: "portfolio",
  profile: "profile",
};

const SCREEN_TO_TAB: Partial<Record<Screen, NavTab>> = {
  dashboard: "home", "account-detail": "home", "txn-detail": "home", statement: "home",
  "send-money": "payments", "bill-pay": "payments", "split-bill": "payments", "txn-status": "payments",
  cards: "cards", "card-detail": "cards", "apply-card": "cards",
  portfolio: "invest", "mutual-funds": "invest", "fund-detail": "invest", "sip-setup": "invest", "digital-gold": "invest",
  profile: "profile", security: "profile", notifications: "profile", pin: "profile",
  support: "profile", faq: "profile", ticket: "profile",
  rewards: "profile", referral: "profile", redemption: "profile",
  spend: "home", budget: "home", ai: "home",
  pots: "home", "create-pot": "home", "pot-detail": "home",
  deposits: "home", "create-deposit": "home", "deposit-detail": "home",
  loans: "home", "loan-detail": "home", "loan-apply": "home",
};

const ONBOARDING: Screen[] = ["splash","login","otp","kyc-details","kyc-video","account-tier","biometric-setup"];

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────

const DEFAULT_NAV: NavState = {
  screen: "splash", tab: "home",
  accountId: "ACC-SVG-001", txnId: "TXN-001",
  cardId: "CARD-001", potId: "POT-001",
  depositId: "FD-001", loanId: "LN-2023-004421",
  fundId: "MF-004", ticketId: "TKT-001",
  isNewUser: false,
};

export default function App() {
  const [nav, setNav] = useState<NavState>(DEFAULT_NAV);

  const go = useCallback((screen: Screen, params?: Partial<NavState>) => {
    setNav(n => ({
      ...n,
      ...params,
      screen,
      tab: SCREEN_TO_TAB[screen] ?? n.tab,
      prevScreen: n.screen,
    }));
  }, []);

  const back = useCallback(() => {
    setNav(n => ({ ...n, screen: n.prevScreen ?? "dashboard", tab: SCREEN_TO_TAB[n.prevScreen ?? "dashboard"] ?? n.tab }));
  }, []);

  const handleTab = useCallback((tab: NavTab) => {
    setNav(n => ({ ...n, tab, screen: TAB_SCREENS[tab], prevScreen: n.screen }));
  }, []);

  const logout = useCallback(() => setNav({ ...DEFAULT_NAV, screen: "login" }), []);

  const isOnboarding = ONBOARDING.includes(nav.screen);
  const showTab = !isOnboarding && (nav.screen in SCREEN_TO_TAB);
  const activeTab = SCREEN_TO_TAB[nav.screen] ?? nav.tab;

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: font, background: C.bg }}>

      {/* ── Onboarding ── */}
      {nav.screen === "splash" && <SplashScreen onComplete={() => go("login")} />}
      {nav.screen === "login" && <LoginScreen onLogin={() => go("otp")} onRegister={() => go("otp", { isNewUser: true })} />}
      {nav.screen === "otp" && <OTPScreen channel="sms" target="+91 98765 43210" onBack={() => go("login")} onVerified={() => nav.isNewUser ? go("kyc-details") : go("dashboard")} />}
      {nav.screen === "kyc-details" && <KYCDetailsScreen onBack={() => go("otp")} onComplete={() => go("kyc-video")} />}
      {nav.screen === "kyc-video" && <VideoKYCScreen onBack={() => go("kyc-details")} onComplete={() => go("account-tier")} />}
      {nav.screen === "account-tier" && <AccountTierScreen onBack={() => go("kyc-video")} onSelect={() => go("biometric-setup")} />}
      {nav.screen === "biometric-setup" && <BiometricSetupScreen onBack={() => go("account-tier")} onComplete={() => go("dashboard", { isNewUser: false })} />}

      {/* ── Authenticated ── */}
      {!isOnboarding && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

            {/* M2: Dashboard */}
            {nav.screen === "dashboard" && <Dashboard onNav={go} />}

            {/* M3: Accounts */}
            {nav.screen === "account-detail"  && <AccountDetailScreen accountId={nav.accountId} onBack={back} onNav={go} />}
            {nav.screen === "txn-detail"       && <TransactionDetailScreen txnId={nav.txnId} onBack={back} onNav={go} />}
            {nav.screen === "statement"        && <StatementScreen accountId={nav.accountId} onBack={back} />}

            {/* M4: Payments */}
            {nav.screen === "send-money"  && <SendMoneyScreen onBack={back} onNav={go} />}
            {nav.screen === "bill-pay"    && <BillPayScreen onBack={back} onNav={go} />}
            {nav.screen === "split-bill"  && <SplitBillScreen onBack={back} onNav={go} />}
            {nav.screen === "txn-status"  && <TxnStatusScreen type={nav.txnStatusType ?? "success"} onBack={() => go("dashboard")} onNav={go} />}

            {/* M5: Cards */}
            {nav.screen === "cards"       && <CardsScreen onBack={back} onNav={go} />}
            {nav.screen === "card-detail" && <CardDetailScreen cardId={nav.cardId} onBack={back} onNav={go} />}
            {nav.screen === "apply-card"  && <ApplyCardScreen onBack={back} onNav={go} />}

            {/* M6: Pots */}
            {nav.screen === "pots"        && <PotsScreen onBack={back} onNav={go} />}
            {nav.screen === "create-pot"  && <CreatePotScreen onBack={back} onDone={() => go("pots")} />}
            {nav.screen === "pot-detail"  && <PotDetailScreen potId={nav.potId} onBack={back} />}

            {/* M7: Deposits */}
            {nav.screen === "deposits"        && <DepositsScreen onBack={back} onNav={go} />}
            {nav.screen === "create-deposit"  && <CreateDepositScreen onBack={back} onDone={() => go("deposits")} />}
            {nav.screen === "deposit-detail"  && <DepositDetailScreen depositId={nav.depositId} onBack={back} />}

            {/* M8: Loans */}
            {nav.screen === "loans"       && <LoansScreen onBack={back} onNav={go} />}
            {nav.screen === "loan-detail" && <LoanDetailScreen loanId={nav.loanId} onBack={back} />}
            {nav.screen === "loan-apply"  && <LoanApplyScreen onBack={back} onDone={() => go("loans")} />}

            {/* M9: Investments */}
            {nav.screen === "portfolio"    && <PortfolioScreen onBack={back} onNav={go} />}
            {nav.screen === "mutual-funds" && <MutualFundsScreen onBack={back} onNav={go} />}
            {nav.screen === "fund-detail"  && <FundDetailScreen fundId={nav.fundId} onBack={back} onNav={go} />}
            {nav.screen === "sip-setup"    && <SIPSetupScreen fundId={nav.fundId} onBack={back} onDone={() => go("portfolio")} />}
            {nav.screen === "digital-gold" && <DigitalGoldScreen onBack={back} />}

            {/* M10: Rewards */}
            {nav.screen === "rewards"    && <RewardsScreen onBack={back} onNav={go} />}
            {nav.screen === "redemption" && <RedemptionScreen onBack={back} />}
            {nav.screen === "referral"   && <ReferralScreen onBack={back} />}

            {/* M11: Spend */}
            {nav.screen === "spend"  && <SpendScreen onBack={back} onNav={go} />}
            {nav.screen === "budget" && <BudgetScreen onBack={back} />}

            {/* M12: AI */}
            {nav.screen === "ai" && <AIScreen onBack={back} />}

            {/* M13: Profile & Security */}
            {nav.screen === "profile"       && <ProfileScreen onBack={back} onNav={go} onLogout={logout} />}
            {nav.screen === "security"      && <SecurityScreen onBack={back} />}
            {nav.screen === "notifications" && <NotificationsScreen onBack={back} onNav={go} />}
            {nav.screen === "pin"           && <PINScreen onBack={back} />}

            {/* M14: Support */}
            {nav.screen === "support" && <SupportScreen onBack={back} onNav={go} />}
            {nav.screen === "faq"     && <FAQScreen onBack={back} />}
            {nav.screen === "ticket"  && <TicketScreen ticketId={nav.ticketId} onBack={back} />}

            {/* Legacy */}
            {nav.screen === "upi"          && <UPIScreen onBack={back} />}
            {nav.screen === "upi-scan"     && <UPIScreen onBack={back} initialView="scan" />}
            {nav.screen === "fraud"        && <FraudScreen onBack={() => go("dashboard")} onNav={go} />}
            {nav.screen === "dispute-form" && <DisputeFormScreen txnId={nav.txnId} onBack={back} onDone={() => go("dashboard")} />}

          </div>
          {showTab && <BottomNav active={activeTab} onChange={handleTab} />}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
