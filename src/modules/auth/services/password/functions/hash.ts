// import { hash as hashPassword } from "argon2";

// export const hash = async (password: string) => {
//   if (typeof password !== "string" || !password) {
//     throw new Error("Invalid password provided for hashing.");
//   }
//   const hashed = await hashPassword(password);
//   return hashed;
// };

import { hash as hashPassword } from "bcrypt";

export const hash = async (password: string) => {
  if (typeof password !== "string" || !password) {
    throw new Error("Invalid password provided for hashing.");
  }
  const hashed = await hashPassword(password, 10)
  return hashed;
};
