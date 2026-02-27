import db from "#database/index.js";
import { verify } from "./verify.js";

export const confirmUserPassword = async (userId: string, password: string) => {
  const account = await db.query.accounts.findFirst({
    where: (accounts, { eq }) => eq(accounts.userId, userId),
    columns: {
      password: true
    }
  });

  if (!account || !account.password) {
    return false;
  }

  const isValid = await verify({ hash: account.password, password });

  return isValid;
};
