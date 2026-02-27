import { verify as argonVerify } from "argon2";

type VerifyPasswordInput = {
  hash: string;
  password: string;
};

export const verify = async ({ hash, password }: VerifyPasswordInput) => {
  const isValid = await argonVerify(hash, password);
  return isValid;
};
