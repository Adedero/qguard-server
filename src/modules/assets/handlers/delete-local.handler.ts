import db from "#database/index.js";
import { MAX_FILES_PER_DELETE } from "#utils/constants.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { Text } from "#utils/text/index.js";
import z from "zod";
import { deleteLocalAsset } from "../utils/delete-local-asset.js";

export const deleteLocal = defineRequestHandler({
  validator: {
    body: z.object({
      ids: z
        .array(z.string().refine((val) => Text.isULID(val), "Invalid file ID"))
        .min(1, "No files specified for deletion")
        .max(MAX_FILES_PER_DELETE, `Limit: ${MAX_FILES_PER_DELETE} files`)
    })
  },
  async handler(ctx) {
    const { ids } = ctx.validated.body;
    const { succeeded, failed } = await deleteLocalAsset(ids, { db });

    const results = {
      succeeded: succeeded.length,
      failed: failed.length,
      files: succeeded.map((t) => t.id),
      errors: failed.map((t) => ({
        file: t.id,
        error: t.error ?? "Unknown error"
      }))
    };

    const status =
      results.failed > 0
        ? results.succeeded > 0
          ? 207 // Partial success
          : 500
        : 200;

    ctx.res.status(status).json({
      success: status >= 200 && status < 300,
      status,
      message:
        results.failed === 0
          ? "Deletion complete"
          : results.succeeded > 0
            ? "Partial deletion failed"
            : "Deletion failed",
      data: results
    });
  }
});
