// Mock KYC service — production replacements noted per function.
// ⚠️ REGULATORY: All functions marked [RBI-regulated] require licensed
//    third-party integrations before going live in India.

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export type KYCTier = "min" | "full";
export type AccountTier = "essential" | "savings" | "prime";

export interface PANResult {
  valid: boolean;
  nameOnPAN?: string;
  error?: string;
}

export interface AadhaarResult {
  valid: boolean;
  ref?: string;
  error?: string;
}

export const kycService = {
  // ⚠️ [RBI-regulated] Production: NSDL PAN verification API
  async verifyPAN(pan: string, nameAsPerPAN: string): Promise<PANResult> {
    await delay(1000);
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
      return { valid: false, error: "Invalid PAN format. Expected: AAAAA9999A" };
    }
    return { valid: true, nameOnPAN: nameAsPerPAN };
  },

  // ⚠️ [RBI-regulated] Production: DigiLocker / UIDAI masked-Aadhaar OTP-based verification
  async verifyAadhaar(aadhaar: string): Promise<AadhaarResult> {
    await delay(900);
    const clean = aadhaar.replace(/\s/g, "");
    if (!/^\d{12}$/.test(clean)) {
      return { valid: false, error: "Aadhaar must be 12 digits" };
    }
    return { valid: true, ref: `AA-${Date.now()}` };
  },

  // ⚠️ [RBI-regulated] Production: VCIP-compliant video KYC via IDfy / Signzy / Perfios
  async initiateVideoKYC(): Promise<{ sessionId: string; sessionUrl: string }> {
    await delay(600);
    return {
      sessionId: `VKYC-${Date.now()}`,
      sessionUrl: "https://vkyc.example.com/session/mock",
    };
  },

  // Sets the account tier after KYC completion
  async setAccountTier(tier: AccountTier): Promise<{ success: boolean }> {
    await delay(400);
    console.log(`[mock] Account tier set to: ${tier}`);
    return { success: true };
  },
};
