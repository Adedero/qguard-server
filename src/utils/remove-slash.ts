export const removeSlash = (str: string, position: "start" | "end" | "both" = "both") => {
  if (position === "start") {
    return str.replace(/^\/+/, "");
  } else if (position === "end") {
    return str.replace(/\/+$/, "");
  } else {
    return str.replace(/^\/+|\/+$/g, "");
  }
};
