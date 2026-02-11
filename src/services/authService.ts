interface ForgotPasswordResponse {
  statusMsg?: string;
  message?: string;
  [key: string]: any;
}

interface VerifyCodeResponse {
  status?: string;
  message?: string;
  verified?: boolean;
  [key: string]: any;
}

interface ResetPasswordResponse {
  status?: string;
  message?: string;
  token?: string;
  [key: string]: any;
}

export const authService = {
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Failed to send reset code");
    }

    return data;
  },

  verifyResetCode: async (resetCode: string, email: string): Promise<VerifyCodeResponse> => {
    const response = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resetCode, email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Invalid verification code");
    }

    return data;
  },

 
  resetPassword: async (newPassword: string, rePassword: string): Promise<ResetPasswordResponse> => {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword, rePassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Failed to reset password");
    }

    return data;
  },

 
  changeMyPassword: async (
    currentPassword: string, 
    newPassword: string, 
    rePassword: string
  ): Promise<ResetPasswordResponse> => {
    const response = await fetch("/api/auth/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        password: newPassword,
        rePassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Failed to change password");
    }

    return data;
  },

 
  completePasswordReset: async (
    email: string,
    resetCode: string,
    newPassword: string,
    rePassword: string
  ): Promise<ResetPasswordResponse> => {
    await authService.verifyResetCode(resetCode, email);
    
    const result = await authService.resetPassword(newPassword, rePassword);
    
    return result;
  }
};