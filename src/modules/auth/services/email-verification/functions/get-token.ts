import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import type { VerificationModel } from "#database/models/verification.model.js";
import { HttpException } from "#errors/http-exception.js";
import { and, eq } from "drizzle-orm";
import { generateToken } from "./generate-token.js";
import { VERIFICATION_TOKEN_EXPIRES_IN_HOURS } from "#utils/constants.js";

export type GetTokenOptions =
  | { tokenExpiryInHours?: number; throwOnError: true }
  | { tokenExpiryInHours?: number; throwOnError?: false };

// When throwOnError: true → always returns token
export async function getToken(
  identifier: string,
  verificationType: VerificationModel["type"],
  options: { tokenExpiryInHours?: number; throwOnError: true }
): Promise<{ hash: string; raw: string }>;

// When omitted or false → may return undefined
export async function getToken(
  identifier: string,
  verificationType: VerificationModel["type"],
  options?: { tokenExpiryInHours?: number; throwOnError?: false }
): Promise<{ hash: string; raw: string } | undefined>;

// Implementation
export async function getToken(
  identifier: string,
  verificationType: VerificationModel["type"],
  options?: GetTokenOptions
): Promise<{ hash: string; raw: string } | undefined> {
  const { tokenExpiryInHours = VERIFICATION_TOKEN_EXPIRES_IN_HOURS, throwOnError = false } =
    options ?? {};

  await db
    .delete(Table.verifications)
    .where(
      and(
        eq(Table.verifications.identifier, identifier),
        eq(Table.verifications.type, verificationType)
      )
    );

  const { value, raw, expiresAt } = generateToken(tokenExpiryInHours);

  const newToken = (
    await db
      .insert(Table.verifications)
      .values({
        identifier,
        type: verificationType,
        value,
        expiresAt
      })
      .returning({ value: Table.verifications.value })
  )[0];

  if (!newToken) {
    if (throwOnError) {
      throw HttpException.INTERNAL("Failed to create verification token.");
    }
    return undefined;
  }

  return { hash: newToken.value, raw };
}