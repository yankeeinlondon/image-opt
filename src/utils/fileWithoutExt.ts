import { removePath } from "./removePath";

export const fileWithoutExt = (file: string) =>
  removePath(file).replace(/\.\s*$/, "");
