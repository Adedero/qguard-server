import { fileTypeFromMime } from "./lib/file-type-from-mime.js";
import { formatFileBytes } from "./lib/format-file-bytes.js";
import { getFileName } from "./lib/get-file-name.js";
import { getFileType } from "./lib/get-file-type.js";
import { isFileSizeValid } from "./lib/is-file-size-valid.js";
import { isFileTypeAllowed } from "./lib/is-file-type-allowed.js";
import { isUploadPathValid } from "./lib/is-upload-path-valid.js";

export const FileManager = {
  fileTypeFromMime,
  formatFileBytes,
  getFileName,
  getFileType,
  isFileSizeValid,
  isFileTypeAllowed,
  isUploadPathValid
};
