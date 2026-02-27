import type { AssetType } from "../types.js";

/**
 * Categorizes a MIME type into a specific QGuard asset type.
 */
export function fileTypeFromMime(mimeType: string): AssetType {
  if (!mimeType) return "other";

  const mime = mimeType.toLowerCase().trim();

  // 1. Explicit Document Matches
  const documentMimes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
    "application/rtf"
  ];
  if (documentMimes.includes(mime)) return "document";

  // 2. Explicit Archive Matches
  const archiveMimes = [
    "application/zip",
    "application/x-7z-compressed",
    "application/x-rar-compressed",
    "application/x-tar",
    "application/x-gzip",
    "application/x-bzip2"
  ];
  if (archiveMimes.includes(mime)) return "archive";

  // 3. Prefix Matches (The "Type" part of the MIME)
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";

  // 4. Fallback for specific text types that are essentially documents
  if (mime.startsWith("text/")) return "document";

  return "other";
}
