interface ChangePasswordResponse {
  status?: string;
  message?: string;
  token?: string;
  [key: string]: any;
}

interface UpdateProfileResponse {
  status?: string;
  message?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role?: string;
  };
  [key: string]: any;
}

export const userService = {
  /**
   * CHANGE PASSWORD - For logged in users
   * Endpoint: PUT /api/auth/change-password
   * Headers: token (automatically added from next-auth)
   * Body: { 
   *   currentPassword: string,
   *   password: string, 
   *   rePassword: string 
   * }
   */
  changePassword: async (
    currentPassword: string,
    password: string,
    rePassword: string
  ): Promise<ChangePasswordResponse> => {
    const response = await fetch("/api/auth/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        password,
        rePassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Failed to change password");
    }

    return data;
  },

  /**
   * UPDATE PROFILE - Update logged user data
   * Endpoint: PUT /api/user/update
   * Headers: token (automatically added from next-auth)
   * Body: { name, email, phone }
   */
      updateProfile: async (userData: {
    name: string;
    email: string;
    phone: string; // phone is required string, even if empty
  }): Promise<UpdateProfileResponse> => {
    const response = await fetch("/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: userData.phone, // Always send phone, never omit
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update profile");
    }

    return data;
  }
};