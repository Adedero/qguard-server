import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { HttpException } from "#errors/http-exception.js";
import { eq } from "drizzle-orm";
import { PasswordService } from "../../password/index.js";

export type ResetPasswordOptions = {
  newPassword: string;
  userId: string;
};
export async function resetPassword(options: ResetPasswordOptions) {
  const { newPassword, userId } = options;

  const account = await db.query.accounts.findFirst({
    where: eq(Table.accounts.userId, userId)
  });

  if (!account) {
    throw HttpException.NOT_FOUND("User account not found");
  }

  const { password } = account;

  if (password && (await PasswordService.verify({ hash: password, password: newPassword }))) {
    throw HttpException.BAD_REQUEST("New password must be different from the old password");
  }

  const newPasswordHash = await PasswordService.hash(newPassword);

  const [result] = await db
    .update(Table.accounts)
    .set({ password: newPasswordHash })
    .where(eq(Table.accounts.userId, userId))
    .returning({
      id: Table.accounts.id
    });

  if (!result) {
    throw HttpException.INTERNAL("Failed to save new password. Try again later.");
  }

  return result;
}
