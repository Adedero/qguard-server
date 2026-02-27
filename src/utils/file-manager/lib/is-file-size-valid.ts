export function isFileSizeValid(file: File | Blob | Buffer, size: number) {
  const fileSize = file instanceof File || file instanceof Blob ? file.size : file.length;
  return fileSize <= size;
}
