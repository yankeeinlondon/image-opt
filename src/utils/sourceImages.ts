import { globSync } from "fast-glob";

export const sourceImages = (glob: string) => {
  const files = globSync(glob);

  return files;
};
