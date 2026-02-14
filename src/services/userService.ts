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

  
  updateProfile: async (userData: {
    name: string;
    email: string;
    phone: string; 
  }): Promise<UpdateProfileResponse> => {
    const response = await fetch("/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: userData.phone, 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update profile");
    }

    return data;
  }
};