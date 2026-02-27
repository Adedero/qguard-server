import { fileTypeFromBlob } from "file-type";

export async function getFileType(file: File | Blob) {
  const result = await fileTypeFromBlob(file);
  return result;
}
