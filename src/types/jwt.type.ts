export type JWTPayload = {
  id: string;
  email: string;
  emailVerified: boolean;
  role: string;
  banned: boolean;
};
