// Auth
export interface IToken {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
  scope: string;
}

// Login
export interface ILogin {
  username: string;
  password: string;
  client_id: string;
  grant_type: string;
}
