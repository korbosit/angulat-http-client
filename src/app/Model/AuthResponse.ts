// See docs https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: string;
}
