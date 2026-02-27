export function getFileName(file: File | Blob, withExtension: boolean = false): string {
  if (file instanceof File) {
    const name = file.name.replace(/[^a-zA-Z0-9_-]/g, "-");

    if (withExtension) {
      return name;
    }

    const lastDot = name.lastIndexOf(".");
    return lastDot === -1 ? name : name.slice(0, lastDot);
  }
  return crypto.randomUUID();
}
