import { defineRequestHandler } from "#utils/request-handler.js";
import z from "zod";
import { MAX_FILES_PER_DELETE } from "#utils/constants.js";
import { deleteRemoteAssets } from "../utils/delete-remote-assets.js";

export const deleteRemote = defineRequestHandler({
  validator: {
    body: z.object({
      ids: z
        .array(z.string().nonempty("Invalid file ID"))
        .min(1, "No files specified for deletion")
        .max(MAX_FILES_PER_DELETE, `Limit: ${MAX_FILES_PER_DELETE} files`)
    })
  },
  async handler(ctx) {
    const { ids } = ctx.validated.body;

    const results = await deleteRemoteAssets(ids);

    ctx.res.status(200).json({
      success: true,
      status: 200,
      message: "Deletion complete",
      data: { results }
    });
  }
});
