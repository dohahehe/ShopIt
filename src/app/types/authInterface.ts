export interface successLogin {
    message: string
    user: UserResponse
    token: string
}
export interface UserResponse {
    name: string
    email: string
    role: string
}

export interface failedLogin {
    statusMsg: string
    message: string
}

declare module 'next-auth' {
  interface Session {
    user: UserResponse & {
      _id?: string;
      phone?: string;
    };
    token: string; 
  }

  interface JWT {
    user: UserResponse;
    token: string;
  }
}