// Mock auth service — swap function bodies for real API calls in production.
// All functions return the same shape; callers don't need to change.

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export interface AuthUser {
  id: string;
  name: string;
  mobile: string;
  isNewUser: boolean;
}

export const authService = {
  async sendOTP(mobile: string): Promise<{ success: boolean; ref: string }> {
    await delay(700);
    console.log(`[mock] OTP sent to ${mobile}`);
    return { success: true, ref: `OTP-REF-${Date.now()}` };
  },

  async verifyOTP(otp: string, _ref: string): Promise<{ success: boolean; isNewUser: boolean; user?: AuthUser }> {
    await delay(500);
    if (otp !== "123456") return { success: false, isNewUser: false };
    return {
      success: true,
      isNewUser: false,
      user: { id: "CUS-2024-08847", name: "Priya Sharma", mobile: "+91 98765 43210", isNewUser: false },
    };
  },

  async verifyPIN(pin: string): Promise<{ success: boolean }> {
    await delay(300);
    return { success: pin === "1234" };
  },

  async setupBiometric(): Promise<{ success: boolean }> {
    await delay(400);
    return { success: true };
  },
};
