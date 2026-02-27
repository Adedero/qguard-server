import type { Database, DatabaseTransaction } from "#database/index.js";
import { Table } from "#database/models/index.js";
import { HttpException } from "#errors/http-exception.js";
import { toError } from "#utils/to-error.js";
import { inArray } from "drizzle-orm";
import { unlink } from "node:fs/promises";

export interface DeleteLocalAssetOptions {
  db: Database | DatabaseTransaction;
}

export const deleteLocalAsset = async (ids: string[], options: DeleteLocalAssetOptions) => {
  const { db } = options;

  const uniqueIds = [...new Set(ids)];

  const filesToProcess = await db.query.files.findMany({
    where: (t, { inArray }) => inArray(t.id, uniqueIds)
  });


  if (filesToProcess.length === 0) {
    throw HttpException.NOT_FOUND("No files found to delete");
  }

  // 1. Attempt Physical Deletion (no shared mutation)
  const taskOutcomes = await Promise.all(
    filesToProcess.map(async (file) => {
      try {
        await unlink(file.path);
        return { id: file.id, success: true, error: null };
      } catch (rawError) {
        const err = toError(rawError);

        // Proper ENOENT narrowing
        if (isErrnoException(rawError) && rawError.code === "ENOENT") {
          return { id: file.id, success: true, error: null };
        }

        return {
          id: file.id,
          success: false,
          error: err.message
        };
      }
    })
  );

  const succeeded = taskOutcomes.filter((t) => t.success);
  const failed = taskOutcomes.filter((t) => !t.success);

  const idsToRemoveFromDb = succeeded.map((t) => t.id);

  if (idsToRemoveFromDb.length > 0) {
    await db.delete(Table.files).where(inArray(Table.files.id, idsToRemoveFromDb));
  }

  return { taskOutcomes, succeeded, failed };
};

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as any).code === "string"
  );
}
