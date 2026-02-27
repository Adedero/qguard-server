import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { HttpException } from "#errors/http-exception.js";
import { SESSION_EXPIRES_IN_MS } from "#utils/constants.js";
import { Text } from "#utils/text/index.js";
import { addMilliseconds } from "date-fns";
import { eq } from "drizzle-orm";

type CreateSessionOptions = {
  userId: string;
  refreshToken: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export const createSession = async (options: CreateSessionOptions) => {
  const { userId, refreshToken, ipAddress, userAgent } = options;
  const now = new Date();

  const refreshTokenHash = Text.sha256(refreshToken);
  const expiresAt = addMilliseconds(now, SESSION_EXPIRES_IN_MS);

  const lastUsedAt = now;
  const session = await db.transaction(async (tx) => {
    const [result] = await tx
      .insert(Table.sessions)
      .values({
        userId,
        refreshToken: refreshTokenHash,
        expiresAt,
        lastUsedAt,
        ipAddress,
        userAgent
      })
      .returning();

    if (!result) {
      throw HttpException.INTERNAL("Failed to create sign in session");
    }

    await tx
      .update(Table.users)
      .set({ lastLoginMethod: "email", lastLoggedInAt: lastUsedAt, lastActiveAt: lastUsedAt })
      .where(eq(Table.users.id, result.userId));

    return result;
  });

  return session;
};
