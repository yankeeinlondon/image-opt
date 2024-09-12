import type { Sharp } from "sharp";
import { ConfigFor } from "src/types";
import { getOutputOptions } from "src/utils";

export const fallbackImage = (
  sharp: Sharp,
  dest: string,
  config: ConfigFor,
) => {
  const [_, opt] = getOutputOptions(dest, config);
  return sharp
    .jpeg({ ...opt, quality: 60 })
    .resize({
      width: 1600,
      withoutEnlargement: true,
    })
    .toFormat("jpg")
    .toFile(dest);
};
