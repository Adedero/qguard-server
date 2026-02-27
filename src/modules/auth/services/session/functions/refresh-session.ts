import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { HttpException } from "#errors/http-exception.js";
import { Text } from "#utils/text/index.js";
import { eq } from "drizzle-orm";
import { SignInService } from "../../sign-in/index.js";
import { pick } from "#utils/pick.js";

export const refreshSession = async (token: string) => {
  const hash = Text.sha256(token);
  const now = new Date();

  const session = await db.query.sessions.findFirst({
    where: (t, { and, isNull, gt, eq }) =>
      and(eq(t.refreshToken, hash), isNull(t.revokedAt), gt(t.expiresAt, now))
  });

  if (!session) {
    throw HttpException.UNAUTHORIZED("Unauthorized");
  }

  const user = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.id, session.userId)
  });

  if (!user) {
    throw HttpException.UNAUTHORIZED("Unauthorized");
  }

  const { accessToken, refreshToken } = await SignInService.generateAuthTokens(
    pick(user, ["id", "role", "email", "emailVerified", "banned"])
  );

  const refreshTokenHash = Text.sha256(refreshToken);

  await db.transaction(async (tx) => {
    await tx
      .update(Table.sessions)
      .set({
        refreshToken: refreshTokenHash,
        lastUsedAt: now
      })
      .where(eq(Table.sessions.id, session.id));

    await tx
      .update(Table.users)
      .set({ lastActiveAt: now })
      .where(eq(Table.users.id, session.userId));
  });

  return { accessToken, refreshToken };
};
