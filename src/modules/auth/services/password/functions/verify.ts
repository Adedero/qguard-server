//import { verify as argonVerify } from "argon2";
import { compare } from "bcrypt";

type VerifyPasswordInput = {
  hash: string;
  password: string;
};

export const verify = async ({ hash, password }: VerifyPasswordInput) => {
  //const isValid = await argonVerify(hash, password);
  const isValid = await compare(password, hash)
  return isValid;
};
