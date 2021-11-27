export type LoginStatus =
  | 'authorization_expired'
  | 'connected'
  | 'not_authorized'
  | 'unknown';

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
  grantedScopes?: string | undefined;
  reauthorize_required_in?: number | undefined;
}

export interface StatusResponse {
  status: LoginStatus;
  authResponse: AuthResponse;
}

export interface ReactFacebookLoginInfo {
  id: string;
  userID: string;
  accessToken: string;
  name?: string | undefined;
  email?: string | undefined;
  picture?: {
    data: {
      height?: number | undefined,
      is_silhouette?: boolean | undefined,
      url?: string | undefined,
      width?: number | undefined,
    },
  } | undefined;
}

export interface ReactFacebookFailureResponse {
  status?: string | undefined;
}