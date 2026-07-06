Enterprise Core Banking Platform — AI Build Prompts

Three Integrated Applications: Customer Mobile App | Internet Banking Portal | Bank Management Portal (Staff)


0. SHARED SYSTEM CONTEXT (read this before using any of the three prompts below)

All three applications are front-ends over one shared core banking backend. Use this section to keep them integrated — paste it at the top of whichever individual prompt you run, or keep it as standing context in your AI builder.

Shared Data Entities (single source of truth across all 3 apps):


Customer Profile (KYC status, risk tier, linked accounts)
Account (savings/current/loan/wallet, balance, ledger)
Transaction (type, status, channel, timestamp, linked account, fraud flag)
Loan (application, status, EMI schedule, credit score, collections stage)
Payment Instruction (ACH/wire/card/UPI/wallet, currency, corridor: SWIFT/SEPA/domestic)
Fraud Alert (severity, linked transaction, resolution status)
Staff User (role, permissions, branch/department)


Shared Rules:


Any action a customer takes (deposit, withdrawal, loan application, payment) creates a record that must appear in real time on the Bank Management Portal (staff side) — e.g., a customer's loan application instantly appears in the staff loan-queue with "Pending Review" status.
Any staff action (KYC approval, loan approval, fraud flag resolution, EMI restructuring) must reflect back to the customer's Mobile App and Internet Banking Portal in real time (push notification + in-app status update).
Authentication, KYC status, and risk tier are shared across Mobile App and Internet Banking Portal — a customer approved on one channel is instantly approved on the other.
All monetary flows (deposits, withdrawals, loan disbursement, EMI debit, wallet top-up, UPI, card/ACH/wire) funnel through one Transaction Engine so the staff portal's real-time monitoring dashboard sees every channel.
Fraud detection runs centrally; alerts can originate from mobile, web, or staff-initiated manual review, and are visible to staff regardless of origin channel.


Design System (apply consistently across all 3):


Enterprise-grade, trust-driven visual language — avoid generic "startup" styling; reference established digital banking product patterns (clear hierarchy, restrained color, strong data legibility).
Distinct but harmonized themes per app: Mobile App = touch-optimized, single-column, bottom nav; Internet Banking Portal = dashboard-first, multi-column, sidebar nav; Bank Management Portal = data-dense, table/queue-first, role-based navigation.
Shared component language: same iconography, same status-color coding (e.g., green = completed/approved, amber = pending, red = flagged/rejected) across all three so staff and customers interpret status identically.



1. CUSTOMER MOBILE APP — Build Prompt

App purpose: Primary daily-use channel for retail/business customers to manage accounts, payments, loans, and wallet on iOS/Android.

Build this as a mobile app with the following modules and COMPLETE user flows. Do not skip any flow — each one must include entry point, all intermediate steps, success state, and failure/edge-case state.

1.1 Onboarding & KYC (Core Banking Automation)


Flow: Splash → Language/region select → "New customer" vs "Existing customer login"
New customer: Mobile number entry → OTP verification → Email entry → OTP/link verification → Personal details form (name, DOB, address) → Document upload (ID proof, address proof, selfie for liveness match) → Auto-KYC status screen ("Under Review" with estimated time) → Push notification on approval/rejection → If approved: set login PIN/biometric → Account type selection (savings/current) → Nominee details → Terms acceptance → Account created confirmation with account number
Edge cases: document re-upload on rejection with reason shown, OTP resend/timeout, duplicate PAN/ID detection message, offline document upload queue
Existing customer: Login (mobile/username + PIN/biometric) → MFA on new device → Dashboard


1.2 Account Management & Real-Time Transactions (Core Banking Automation)


Dashboard: account balance cards (multi-account carousel), recent transactions feed (real-time, auto-refreshing), quick actions (send money, pay bill, deposit, apply loan)
Flow: Tap account → Account details (balance, IBAN/account number, statement) → Filter/search transactions → Tap transaction → Transaction detail (status, channel, reference ID, dispute option)
Real-time monitoring: live transaction status indicator (Processing → Completed/Failed), push notification on every debit/credit
Statement flow: select date range → generate → view/download/share (PDF/CSV)


1.3 Deposits & Withdrawals (Core Banking Automation)


Deposit flow: Select account → Deposit method (bank transfer/cash via branch locator/check via camera capture) → Enter amount → Confirm → Status tracking screen → Completion notification
Withdrawal flow: Select account → Withdrawal method (ATM locator, cardless withdrawal code generation, transfer-out) → Enter amount → Balance/limit check → OTP confirm → Success screen with reference ID
Edge case: insufficient balance, daily limit exceeded, held/frozen account messaging


1.4 Loan & Credit Management


Loan discovery: Loan products list (personal/home/auto/business) with eligibility pre-check (soft credit pull)
Origination flow: Select loan type → Enter amount & tenure → Auto-calculated EMI preview → Upload supporting docs (income proof, bank statements) → Submit application → Status tracker screen (Submitted → Under Review → Credit Assessment → Approved/Rejected/More Info Needed) → e-sign loan agreement on approval → Disbursement confirmation
Credit scoring visibility: "My Credit Score" screen showing score, factors affecting it, historical trend
EMI management: EMI schedule calendar view → upcoming EMI reminder (push + in-app banner) → pay EMI early/manually → auto-debit mandate setup/edit → missed EMI flow (grace period notice → penalty disclosure → repayment plan option)
Collections/recovery (customer-facing side): overdue notice screen → contact collections support → propose restructuring request → track restructuring approval status


1.5 Secure Payment Processing


Send money flow: Select payee (saved/new) → Select rail (domestic transfer/ACH/wire/card/UPI) → Enter amount & currency → If cross-border: corridor selection (SWIFT/SEPA) with fee/FX-rate preview → Review screen → Biometric/PIN/OTP confirm → Real-time status (Processing → Completed) → Receipt
Card payments: Add card (tokenized) → Manage cards (freeze/unfreeze, set limits) → Pay via card flow
Multi-currency: currency selector on wallet/account, live FX rate display, multi-currency balance view
Fraud alerts (customer side): real-time push alert on suspicious transaction → in-app "Was this you?" confirm/deny flow → auto-freeze on deny → case reference number issued


1.6 Digital Wallet


Wallet setup: activate wallet → link funding source → set wallet PIN
Wallet home: balance, top-up (from account/card), send from wallet, wallet-to-bank withdrawal, transaction history
P2P wallet transfer flow: select contact → enter amount → confirm → instant transfer


1.7 UPI (Fintech)


UPI setup: link bank account → set/verify UPI PIN → create/select UPI ID
Pay via UPI: scan QR / enter UPI ID / select contact → enter amount → UPI PIN confirm → instant success screen
Receive via UPI: show my QR / share UPI ID → collect request flow (approve/decline incoming request)
UPI transaction history integrated into main transaction feed


1.8 Enterprise-Grade Requirements (apply across all flows above)


Session timeout & re-authentication flow
Device management screen (view/revoke logged-in devices)
Multi-language support toggle
Accessibility: large-text mode, screen-reader labels on all flows
In-app support/chat escalation from any error state