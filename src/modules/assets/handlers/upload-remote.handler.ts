import z from "zod";
import formidable from "formidable";
import { defineRequestHandler } from "#utils/request-handler.js";
import { MAX_FILE_SIZE, MAX_FILES_PER_UPLOAD } from "#utils/constants.js";
import { isFileTypeAllowed } from "#utils/file-manager/lib/is-file-type-allowed.js";
import { resolve } from "node:path";
import { toError } from "#utils/to-error.js";
import { HttpException } from "#errors/http-exception.js";
import cloudinary from "#config/cloudinary.config.js";
import type { UploadApiResponse } from "cloudinary";
import { createReadStream } from "node:fs";
import { mkdir, unlink } from "node:fs/promises";
import { FileManager } from "#utils/file-manager/index.js";

type FileAsset = {
  id: string;
  filename: string;
  path: string;
  url: string;
  type: string;
  mimeType: string;
  ext: string;
  size: number;
};

export const uploadRemote = defineRequestHandler({
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

    const tmp = resolve(process.cwd(), "tmp");

    await mkdir(tmp, { recursive: true });

    const form = formidable({
      uploadDir: tmp,
      keepExtensions: true,
      maxFiles: MAX_FILES_PER_UPLOAD,
      maxFileSize: MAX_FILE_SIZE,
      filename: (name, ext) => `${crypto.randomUUID().toUpperCase()}${ext}`,
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

      const uploadedFiles = Object.values(result.files).flat().filter(Boolean) as formidable.File[];
      if (!uploadedFiles.length) {
        throw HttpException.BAD_REQUEST("No files uploaded");
      }

      const results = await Promise.all(
        uploadedFiles.map(async (file) => {
          const response = await new Promise<UploadApiResponse>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: dir, resource_type: "auto" },
              (error, result) => {
                if (error || !result) return reject(error || new Error("Failed to upload stream"));
                resolve(result);
              }
            );
            createReadStream(file.filepath).pipe(stream);
          });

          await unlink(file.filepath).catch(() => {});

          const payload: FileAsset = {
            id: response.public_id,
            filename: file.newFilename,
            path: response.secure_url,
            url: response.secure_url,
            type: file.mimetype
              ? FileManager.fileTypeFromMime(file.mimetype)
              : response.resource_type,
            mimeType: file.mimetype || response.format,
            ext: response.format,
            size: response.bytes
          };

          return payload;
        })
      );

      ctx.res.status(200).json({
        success: true,
        status: 200,
        message: "Files uploaded successfully",
        data: { files: results }
      });
    } catch (error) {
      throw HttpException.BAD_REQUEST(`Failed to upload files: ${toError(error).message}`);
    }
  }
});
