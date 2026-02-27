import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { HttpException } from "#errors/http-exception.js";
import { MAX_FILE_SIZE, MAX_FILES_PER_UPLOAD } from "#utils/constants.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import z from "zod";
import formidable from "formidable";
import { isFileTypeAllowed } from "#utils/file-manager/lib/is-file-type-allowed.js";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import { toError } from "#utils/to-error.js";
import { ulid } from "ulid";
import env from "#lib/env/index.js";
import { FileManager } from "#utils/file-manager/index.js";
import { removeSlash } from "#utils/remove-slash.js";

export const uploadLocal = defineRequestHandler({
  validator: {
    query: z.object({
      dir: z.string("Invalid directory").nonempty("Invalid directory").optional(),
      accept: z
        .string("Invalid accept")
        .nonempty("Invalid accept")
        .transform((value) => value.split(","))
        .default([])
    })
  },
  async handler(ctx) {
    const { dir = "", accept } = ctx.validated.query;

    const directory = path.resolve("public/uploads", dir);
    await mkdir(directory, { recursive: true });

    const form = formidable({
      keepExtensions: true,
      maxFiles: MAX_FILES_PER_UPLOAD,
      maxFileSize: MAX_FILE_SIZE,
      filename: (name, ext) => `${crypto.randomUUID().toUpperCase()}${ext}`,
      uploadDir: directory,
      filter: ({ originalFilename, mimetype }) => {
        const ext = originalFilename?.split(".")?.pop() || "";
        return isFileTypeAllowed(ext, mimetype || "", accept);
      }
    });

    try {
      const result = await new Promise<{
        field: Record<string, string[] | undefined>;
        files: Record<string, formidable.File[] | undefined>;
      }>((resolve, reject) => {
        form.parse(ctx.req, (err, field, files) => {
          if (err) {
            reject(toError(err));
          } else {
            resolve({ field, files });
          }
        });
      });

      const { files } = result.files;

      if (!files || files.length === 0) {
        throw HttpException.BAD_REQUEST("No files uploaded");
      }

      const uploadedFiles = files.map((file) => {
        return {
          id: ulid(),
          filename: file.newFilename,
          path: file.filepath,
          url: `${env.get("BASE_URL")}/uploads/${removeSlash(dir, "both")}/${file.newFilename}`,
          type: FileManager.fileTypeFromMime(file.mimetype || ""),
          mimeType: file.mimetype || "",
          ext: file.originalFilename?.split(".")?.pop() || "",
          size: file.size
        };
      });

      const uploadResult = await db.insert(Table.files).values(uploadedFiles).returning();

      ctx.res.status(200).json({
        success: true,
        status: 200,
        message: "Files uploaded successfully",
        data: { files: uploadResult }
      });
    } catch (error) {
      throw HttpException.BAD_REQUEST(`Failed to upload files: ${toError(error).message}`);
    }
  }
});
