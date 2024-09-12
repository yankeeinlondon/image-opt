import { fileWithoutPath } from "./fileWithoutPath";

export const fileWithoutExt = (file: string) =>
  fileWithoutPath(file).replace(/\..*/, "");
