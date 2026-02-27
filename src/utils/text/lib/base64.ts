export const encodeBase64 = (content: string) => Buffer.from(content, "utf8").toString("base64");

export const decodeBase64 = (content: string) => Buffer.from(content, "base64").toString("utf8");
